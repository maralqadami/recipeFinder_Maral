export default function ErrorBox({ title, message }: { title: string; message: string }) {
  return (
    <div className="notice notice-error" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}
