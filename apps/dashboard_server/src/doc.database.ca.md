# How to use CA from aws rds to connect?

## Problems? Why?

AWS RDS의 SSL 인증서는 도메인 이름(db20250627.cr82sc44iv90.us-west-1.rds.amazonaws.com)에 대해 발급된다.
인증서에는 CN(Common Name) 또는 SAN(Subject Alternative Name)에 이 도메인만 포함되어 있다.

> using hosts file
> /etc/hosts
> 127.0.0.1 db20250627.cr82sc44iv90.us-west-1.rds.amazonaws.com

### **1. 문제의 근본 원인**

AWS RDS의 SSL 인증서는 **도메인 이름**(db20250627.cr82sc44iv90.us-west-1.rds.amazonaws.com)에 대해 발급된다.

인증서에는 CN(Common Name) 또는 SAN(Subject Alternative Name)에 이 도메인만 포함되어 있다.

따라서 다음 연결은 불일치로 실패한다.

```sh
host = localhost
↓
SSL handshake 중 서버 인증서의 CN 검증
↓
"localhost" ≠ "db20250627.cr82sc44iv90.us-west-1.rds.amazonaws.com"
→ Hostname mismatch → 인증 실패
```

즉, **CA 인증서 파일을 사용하더라도** 로컬 호스트 이름이 다르면 TLS 검증이 통과되지 않는다.

CA는 서버의 인증서 서명만 보증할 뿐, 클라이언트가 지정한 host 이름과 CN이 일치해야 handshake가 완성된다.

---

### **2. 왜 SSH 터널에서는 이런 불일치가 생기는가**

SSH 터널 명령은 RDS와의 TCP 연결을 EC2를 통해 “프록시”로 전달할 뿐이다.

로컬 입장에서는 단지 localhost:5432로 접속할 뿐, 실제 연결 대상이 RDS임을 SSL 계층은 모른다.

따라서 SSL 레이어는 “localhost”라는 이름으로 검증을 시도하게 된다.

---

### **3. 해결 방법**

### **(A)**

### **CA 파일 비활성화 + 검증 비활성화**

SSH 터널 사용 시, 아래처럼 설정한다.

```sh
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}
```

→ SSH 터널이 이미 암호화 채널을 제공하므로 추가적인 TLS 인증은 불필요.

---

### **(B)**

### **host를 RDS 도메인으로 설정하고 CA 파일 사용**

만약 RDS에 직접 접근 가능한 환경이라면 다음 설정이 정식 보안 절차이다.

```sh
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: true,
    ca: fs.readFileSync('/path/to/aws-rds-ca-bundle.pem').toString()
  }
},
host: 'db20250627.cr82sc44iv90.us-west-1.rds.amazonaws.com'
```

→ 이 경우 CN이 일치하므로 TLS 인증이 완전히 검증됨.

---

### **(C)**

### **SSH 터널 + RDS 도메인명 유지 (복잡하지만 완전한 방법)**

1. /etc/hosts에 아래 추가

```sh
127.0.0.1 db20250627.cr82sc44iv90.us-west-1.rds.amazonaws.com
```

1.
2. Sequelize 설정:

```sh
host: 'db20250627.cr82sc44iv90.us-west-1.rds.amazonaws.com',
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: true,
    ca: fs.readFileSync('/path/to/aws-rds-ca-bundle.pem').toString()
  }
}
```

1.
2. SSH 터널 명령에서 host도 동일하게 사용:

```sh
ssh -N -L 5432:db20250627.cr82sc44iv90.us-west-1.rds.amazonaws.com:5432 aws_20250627
```

→ 이렇게 하면 애플리케이션은 RDS의 실제 도메인으로 연결하며, 터널은 그 요청을 로컬에서 RDS로 전달한다.

결과적으로 인증서의 CN 검증이 통과되고 CA 파일도 유효하게 작동한다.

---

### **결론**

- localhost로 연결 시 → CA 인증은 동작하지 않음 (hostname mismatch).
- 터널 사용 시 → rejectUnauthorized: false로 두는 것이 일반적.
- 직접 접근 가능한 환경 또는 /etc/hosts 활용 시 → rejectUnauthorized: true + CA 파일 사용 가능.
