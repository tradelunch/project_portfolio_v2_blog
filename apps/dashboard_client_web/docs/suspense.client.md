# How to use suspense with client components: use hook

예 — 가능합니다. Next.js App Router에서 **서버 컴포넌트(Server Component)**가 데이터를 fetch하고 그 Promise를 **클라이언트 컴포넌트(Client Component)**로 넘겨 React Suspense와 함께 사용하는 패턴이 문서에 소개되어 있습니다.

아래는 해당 패턴의 코드 예시입니다:

---

### **✅ 코드 예시**

```js
// app/posts/getPosts.ts
export async function getPosts() {
    const res = await fetch('https://api.example.com/posts');
    const data = await res.json();
    return data;
}
```

```js
// app/posts/PostsClient.tsx
"use client";

import { use } from "react";

type Post = { id: string; title: string; };

export default function PostsClient({ postsPromise }: { postsPromise: Promise<Post[]> }) {
  const posts = use(postsPromise);
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

```js
// app/posts/page.tsx
import { Suspense } from 'react';
import { getPosts } from './getPosts';
import PostsClient from './PostsClient';

export default function Page() {
    const postsPromise = getPosts(); // await 하지 않음

    return (
        <div>
            <h1>Posts</h1>
            <Suspense fallback={<div>Loading posts...</div>}>
                <PostsClient postsPromise={postsPromise} />
            </Suspense>
        </div>
    );
}
```

---

### **📌 해설**

- getPosts()는 서버 컴포넌트 또는 일반 모듈에서 실행되어 Promise를 반환합니다.
- Page(서버 컴포넌트)에서는 await 없이 getPosts()를 호출하고, 반환된 Promise를 그대로 클라이언트 컴포넌트인 PostsClient에 postsPromise라는 prop으로 전달합니다.
- PostsClient 내부에서는 React의 use() Hook을 사용해 postsPromise가 해결될 때까지 기다리고, 해결되면 데이터를 렌더링합니다.
- Page에서는 Suspense로 감싸서, 클라이언트 컴포넌트가 데이터를 받을 때까지 fallback UI를 보여줍니다.

---

### **⚠️ 주의사항 및 제약**

- 클라이언트 컴포넌트에서는 use()를 사용할 수 있지만, 이는 실험적/최신 기능이므로 버전 호환성이나 제약을 확인해야 합니다.
- 클라이언트 컴포넌트 내부에서 직접 await fetch(...) 형태로 데이터를 바로 요청하면 Suspense가 제대로 동작하지 않거나 빌드 시 문제가 발생할 수 있습니다.
- 서버에서 넘긴 Promise는 **서버에서 생성된 것**이어야 하며, 클라이언트 컴포넌트가 해당 Promise를 받도록 설계해야 합니다.
- 클라이언트에서 자주 변화하는 상태나 사용자 상호작용 기반의 fetch는 useSWR, react-query 같은 라이브러리를 사용하는 것이 더 적절할 수 있습니다.

---

필요하시다면 이 패턴을 “React 19 + Next.js 16” 환경에 맞춰 추가 설정(타입스크립트, 캐싱, 에러 처리 등)까지 포함한 완전한 예제를 제공해드릴 수 있습니다.
