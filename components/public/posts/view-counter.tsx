"use client";

import { useEffect, useState } from "react";

interface ViewCounterProps {
  slug: string;
  initialViewCount?: number;
}

export default function ViewCounter({ slug, initialViewCount = 0 }: ViewCounterProps) {
  const [viewCount, setViewCount] = useState(initialViewCount);
  const [hasCounted, setHasCounted] = useState(false);

  useEffect(() => {
    // Kiểm tra xem đã đếm view cho bài viết này trong session chưa
    const storageKey = `viewed_${slug}`;
    const hasViewed = sessionStorage.getItem(storageKey);

    if (!hasViewed && !hasCounted) {
      // Gọi API để tăng viewCount
      fetch(`/api/posts/${slug}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setViewCount(data.viewCount);
            setHasCounted(true);
            // Đánh dấu đã xem trong session để tránh đếm lại khi refresh
            sessionStorage.setItem(storageKey, "true");
          }
        })
        .catch((error) => {
          console.error("Error incrementing view count:", error);
        });
    }
  }, [slug, hasCounted]);

  // Component này không render gì, chỉ để đếm view
  return null;
}

