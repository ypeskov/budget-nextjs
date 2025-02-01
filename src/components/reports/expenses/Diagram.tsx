type DiagramProps = {
  diagramSrc: string | null;
  noDataText: string;
};

export default function Diagram({ diagramSrc, noDataText }: DiagramProps) {
  return (
    <div className="flex justify-center items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {diagramSrc ? <img src={diagramSrc} alt="Diagram" /> : (
        <p className="text-red-500 text-center text-lg font-bold mb-4">{noDataText}</p>
      )}
    </div>
  );
}