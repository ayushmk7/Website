import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink } from 'lucide-react';

export default function ResumePreview() {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [resumeUrl] = useState("/resume.pdf");

  const [Modules, setModules] = useState<{
    Document: any;
    Page: any;
  } | null>(null);

  useEffect(() => {
    import('react-pdf').then((module) => {
      const { pdfjs, Document, Page } = module;
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

      setModules({ Document, Page });
    });
  }, []);

  const onRefChange = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setContainerWidth(node.clientWidth);

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentBoxSize) {
             setContainerWidth(node.clientWidth);
          }
        }
      });

      resizeObserver.observe(node);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  if (!Modules) {
    return (
      <div className="border-2 border-foreground rounded-2xl bg-white h-[600px] flex items-center justify-center relative bg-gray-100">
        <div className="text-muted-foreground">Loading Resume Preview...</div>
      </div>
    );
  }

  const { Document, Page } = Modules;

  return (
    <div className="border-2 border-foreground rounded-2xl bg-white relative group flex flex-col bg-gray-100">
      <div
        className="w-full flex justify-center items-start bg-white min-h-[600px]"
        ref={onRefChange}
      >
        {containerWidth > 0 && (
          <Document
            file={resumeUrl}
            className="flex justify-center shadow-none w-full"
            loading={
              <div className="flex items-center justify-center h-[600px] w-full text-muted-foreground">
                Loading...
              </div>
            }
            error={
              <div className="flex items-center justify-center h-[600px] w-full text-red-500">
                Failed to load PDF.
              </div>
            }
          >
            <Page
              pageNumber={1}
              width={Math.max(containerWidth - 4, 100)}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="border-2 border-black rounded-lg"
            />
          </Document>
        )}
      </div>

      <a
        href={resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-0 right-0 p-3 rounded-lg bg-white text-black hover:bg-blue-600 hover:text-white transition-colors duration-200 z-20 flex items-center justify-center shadow-md border-2 border-black"
        aria-label="Open Resume in new tab"
      >
        <ExternalLink size={24} />
      </a>
    </div>
  );
}
