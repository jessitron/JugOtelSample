import { useState } from 'react';
import { FaCopy } from 'react-icons/fa';
import { useSessionId } from "../hooks/useSessionId.ts";

const Footer = () => {
  const sessionId = useSessionId();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(err => {
        console.error('Failed to copy session ID: ', err);
      });
  };

  return (
    <footer className="bg-indigo-800 text-white px-6 py-4 flex justify-center items-center gap-2">
      <span>{sessionId}</span>
      <button onClick={handleCopy} title="Copy Session ID" className="text-lg hover:text-yellow-400 transition-colors">
        {copied ? <span className="text-sm text-green-400">Copied!</span> : <FaCopy />}
      </button>
    </footer>
  );
};

export default Footer;
