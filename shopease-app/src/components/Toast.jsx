import React, { useEffect, useRef } from 'react';

const Toast = ({ message, type, onClose }) => {
    const onCloseRef = useRef(onClose);
    
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const timer = setTimeout(() => {
            onCloseRef.current();
        }, 5000); 
        return () => clearTimeout(timer);
    }, []);

    const getBgColor = () => {
        switch (type) {
            case 'success': return 'bg-green-500';
            case 'info': return 'bg-blue-500';
            case 'error':
            default: return 'bg-red-500';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'info': return 'fa-info-circle';
            case 'error':
            default: return 'fa-exclamation-circle';
        }
    };

    const bgColor = getBgColor();
    
    return (
        <div 
            className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-[100] transform transition-all duration-500 ease-in-out flex items-center gap-3 min-w-[300px]`}
            style={{
                animation: 'slideIn 0.3s ease-out forwards'
            }}
        >
            <i className={`fas ${getIcon()} text-xl`}></i>
            <span className="font-medium">{message}</span>
            
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default Toast;