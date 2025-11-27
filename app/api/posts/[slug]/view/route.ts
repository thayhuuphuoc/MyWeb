import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PostStatus } from ".prisma/client";
import { revalidatePath } from "next/cache";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    // Tăng viewCount của bài viết
    const post = await prisma.post.update({
      where: {
        slug: slug,
        status: PostStatus.PUBLISHED,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        viewCount: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Revalidate trang blog và trang chi tiết bài viết để cập nhật viewCount
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/blog");

    return NextResponse.json({
      success: true,
      viewCount: post.viewCount,
    });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

