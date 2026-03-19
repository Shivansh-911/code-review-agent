import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const icons = {
  success: <CheckCircle size={15} className="text-green-400 shrink-0" />,
  error:   <XCircle    size={15} className="text-red-400 shrink-0" />,
  info:    <Info       size={15} className="text-sky-400 shrink-0" />,
};

const styles = {
  success: "border-green-500/30 bg-green-500/8",
  error:   "border-red-500/30   bg-red-500/8",
  info:    "border-sky-500/30   bg-sky-500/8",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), duration);
  }, []);

  const remove = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={addToast}>
      {children}

      {/* Toast container — top right */}
      <div className="fixed top-5 right-5 z-[999] flex flex-col gap-2.5 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.92 }}
              animate={{ opacity: 1, x: 0,  scale: 1 }}
              exit={{   opacity: 0, x: 60,  scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.22, 0.68, 0, 1.2] }}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl bg-zinc-950/90 shadow-2xl min-w-[260px] max-w-[340px] ${styles[t.type]}`}
            >
              {icons[t.type]}
              <span className="text-sm font-body text-zinc-200 leading-snug flex-1">{t.message}</span>
              <button onClick={() => remove(t.id)} className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0">
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);