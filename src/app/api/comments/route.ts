import { NextRequest, NextResponse } from "next/server";
import { createComment } from "@/lib/wp-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, author, authorEmail, content } = body;

    if (!postId || !author || !authorEmail || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const result = await createComment({
      postId: parseInt(postId, 10),
      author,
      authorEmail,
      content,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Failed to submit comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ comment: result.comment }, { status: 200 });
  } catch (error) {
    console.error("Error submitting comment:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

