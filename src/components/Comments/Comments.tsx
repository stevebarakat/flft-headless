"use client";

import { useState, FormEvent } from "react";
import type { WpComment } from "@/types/wp";
import styles from "./Comments.module.css";

type CommentsProps = {
  postId: number;
  comments: WpComment[];
};

type FormData = {
  author: string;
  authorEmail: string;
  content: string;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function Comments({ postId, comments: initialComments }: CommentsProps) {
  const [comments, setComments] = useState<WpComment[]>(initialComments);
  const [formData, setFormData] = useState<FormData>({
    author: "",
    authorEmail: "",
    content: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit comment");
      }

      if (data.comment) {
        setComments((prev) => [data.comment, ...prev]);
      }

      setStatus("success");
      setFormData({ author: "", authorEmail: "", content: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }

  return (
    <div className={styles.comments}>
      <h2 className={styles.heading}>Comments</h2>

      {comments.length > 0 && (
        <div className={styles.list}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.meta}>
                <span className={styles.author}>{comment.author.node.name}</span>
                <time className={styles.date} dateTime={comment.date}>
                  {formatDate(comment.date)}
                </time>
              </div>
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: comment.content }}
              />
            </div>
          ))}
        </div>
      )}

      <div className={styles.formSection}>
        <h3 className={styles.formHeading}>Leave a Comment</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="author" className={styles.label}>
              Name
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className={styles.input}
              disabled={status === "submitting"}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="authorEmail" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="authorEmail"
              name="authorEmail"
              value={formData.authorEmail}
              onChange={handleChange}
              required
              className={styles.input}
              disabled={status === "submitting"}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="content" className={styles.label}>
              Comment
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
              className={styles.textarea}
              disabled={status === "submitting"}
            />
          </div>

          {status === "error" && errorMessage && (
            <div className={styles.error} role="alert">
              {errorMessage}
            </div>
          )}

          {status === "success" && (
            <div className={styles.success} role="alert">
              Thank you! Your comment has been submitted and is awaiting moderation.
            </div>
          )}

          <button
            type="submit"
            className={styles.button}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Submitting..." : "Submit Comment"}
          </button>
        </form>
      </div>
    </div>
  );
}

