export default function Skeleton({ width = "100%", height = "20px" }) {
  return (
    <div
      className="animate-pulse rounded-lg bg-[#1f1f1f]"
      style={{ width, height }}
    ></div>
  );
}
