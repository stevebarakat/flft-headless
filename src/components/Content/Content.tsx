import styles from "./Content.module.css";

type ContentProps = {
  content: string | null;
};

export function Content({ content }: ContentProps) {
  if (!content) {
    return null;
  }

  return (
    <div
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

