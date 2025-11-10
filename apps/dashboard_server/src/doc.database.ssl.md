# AWS Postgres connection with SSL?

ssl: { require: true, rejectUnauthorized: false } 는 PostgreSQL 클라이언트(pg, sequelize)가 SSL(암호화된 연결)을 사용할 때의 동작을 정의하는 옵션이다.

---

### **1.**

### **require: true**

- 의미: **SSL을 반드시 사용하라.**
- PostgreSQL 서버와의 통신 시 TLS/SSL 암호화를 사용하도록 강제한다.
- 서버가 SSL을 지원하지 않으면 연결을 **거부한다**.
- 즉, 평문(암호화되지 않은) 연결은 절대 허용하지 않는다.
- RDS, Cloud SQL 등 대부분의 관리형 DB는 SSL을 요구하므로 필요.

---

### **2.**

### **rejectUnauthorized: false**

- 의미: **서버 인증서 검증을 생략한다.**
- SSL 연결은 시도하지만, 서버 인증서의 유효성을 체크하지 않는다.
    - 보통 SSL 인증서는 CA(인증기관)에 의해 서명되어야 하지만,
      RDS나 사설 서버에서는 자체 서명(Self-signed) 인증서를 사용하는 경우가 많음.
    - 이때 검증을 통과하지 못하므로 연결이 차단될 수 있음.
    - rejectUnauthorized: false를 설정하면 이 검증 과정을 무시한다.

---

### **3. 보안적 의미 요약**

| **옵션**                                  | **기능**                   | **보안 수준** | **설명**                                           |
| ----------------------------------------- | -------------------------- | ------------- | -------------------------------------------------- |
| require: false                            | SSL 비활성화               | 낮음          | 암호화 없이 평문으로 통신                          |
| require: true + rejectUnauthorized: true  | 완전한 SSL 검증            | 높음          | 인증서 유효성까지 검사 (권장, 운영 환경)           |
| require: true + rejectUnauthorized: false | 암호화만 활성화, 검증 생략 | 중간          | 인증서가 신뢰되지 않아도 연결 허용 (테스트 환경용) |

---

### **4. 예시**

### **(1) 테스트/로컬 환경**

```js
dialectOptions: {
  ssl: { require: true, rejectUnauthorized: false }
}
```

### **(2) 운영/프로덕션 환경 (CA 인증서 사용)**

```js
dialectOptions: {
  ssl: {
    require: true,
    ca: fs.readFileSync('/path/to/aws-rds-combined-ca-bundle.pem').toString(),
    rejectUnauthorized: true
  }
}
```

AWS RDS의 공식 CA 인증서는 다음에서 다운로드 가능:

https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html
