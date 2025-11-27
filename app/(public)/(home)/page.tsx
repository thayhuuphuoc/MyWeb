import Home from "@/app/(public)/(home)/_components/home";
import {getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import {ProductStatus} from "@prisma/client";
import {getProducts} from "@/actions/products/queries";

export default function Page() {
  const postsPromise = getPosts({
    page: 1,
    per_page: 8,
    status: PostStatus.PUBLISHED
  })
  const newProductsPromise = getProducts({
    page: 1,
    per_page: 10,
    status: ProductStatus.PUBLISHED,
    sort: 'createdAt.desc'
  })

  return (
    <Home
      postsPromise={postsPromise}
      newProductsPromise={newProductsPromise}
    />
  )
}
