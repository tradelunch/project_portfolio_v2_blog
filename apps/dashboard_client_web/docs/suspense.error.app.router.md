# app router suspense app router handling

## loading.tsx

## error.tsx

핵심 동작 원리: **Next.js App Router는 React의 Suspense를 자동으로 삽입함.**

---

### **1. 자동 Suspense wrapping**

App Router에서 page.tsx, layout.tsx, 그리고 그 안의 **async server component**는 자동으로 **Suspense 경계**로 감싸짐.

즉, PostContent처럼 async로 정의되어 있고 await 또는 Promise를 반환하면, Next.js는 내부적으로 다음과 같이 처리함:

```js
<Suspense fallback={<Loading />}>
    <BlogPage params={params} />
</Suspense>
```

여기서 <Loading />은 app/blog/[username]/[slug]/loading.tsx를 자동으로 불러옴.

즉, PostContent가 데이터를 기다리거나 Promise를 반환하는 순간 Next.js는 해당 경로의 loading.tsx를 보여줌.

---

### **2. 데이터 fetching 시점**

PostContent가 다음 중 하나일 때 자동으로 fallback을 띄움:

- await 호출 중
- Promise 리턴 중 (fetch, axios, setTimeout 등)

```js
const res: any = await new Promise((resolve) => {
  setTimeout(() => {
    resolve({ data: { content: 'hello' } });
  }, 4000);
});
```

이 4초 동안, React는 “이 컴포넌트는 아직 완료되지 않았다”는 상태를 감지하고, Suspense fallback(loading.tsx)으로 전환함.

---

### **3. Error boundary 자동 감지**

throw Error('error')가 발생하면 React Server Components는 이 에러를 해당 경로의 **Error Boundary (error.tsx)**로 위임함.

즉, Next.js는 내부적으로 다음과 같은 형태로 감싸둠:

```js
<ErrorBoundary fallback={<Error />}>
    <Suspense fallback={<Loading />}>
        <BlogPage />
    </Suspense>
</ErrorBoundary>
```

결과적으로:

- 데이터 대기 중 → loading.tsx
- 에러 발생 시 → error.tsx
- 완료 시 → 정상 렌더링

---

### **요약**

| **상황**                       | **동작**               | **처리 파일**                 |
| ------------------------------ | ---------------------- | ----------------------------- |
| async 컴포넌트가 await 중      | Suspense fallback 표시 | loading.tsx                   |
| async 컴포넌트에서 throw Error | Error boundary 표시    | error.tsx                     |
| 데이터 fetch 완료              | 정상 렌더링            | page.tsx + 내부 서버 컴포넌트 |

즉, Next.js는 자동으로 **Suspense와 ErrorBoundary를 주입**하기 때문에, 사용자는 loading.tsx와 error.tsx 파일만 두면 됨.
