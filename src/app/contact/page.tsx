import { ContactForm } from "@/components/ContactForm";
import styles from "./page.module.css";

export default function ContactPage() {
  return (
    <article className={styles.article}>
      <div className={styles.container}>
        <h1 className={styles.title}>Contact Us</h1>
        <div className={styles.content}>
          <p className={styles.intro}>
            For general inquiries, booking a charter, or reporting a bug, send
            us a message and we'll respond as soon as possible.
          </p>
          <ContactForm />
        </div>
      </div>
    </article>
  );
}
