import React, { useState, useEffect, useRef } from 'react';
import type { QuickChatMessage, Attachment, AttachmentType, User } from '../../types';
import { getChatRooms, getMessages as apiGetMessages, sendMessage as apiSendMessage, editMessage as apiEditMessage, deleteMessageApi, hideMessage as apiHideMessage, clearRoom as apiClearRoom } from '../../api';

const AttachmentMenuModal = ({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect: (accept: string) => void; }) => {
    if (!isOpen) return null;

    const options = [
        { label: 'Image', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, accept: 'image/*' },
        { label: 'PDF', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>, accept: '.pdf' },
        { label: 'PowerPoint', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, accept: '.ppt,.pptx' },
        { label: 'Word', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, accept: '.doc,.docx' },
        { label: 'Excel', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h3m-3 4h3m-3 4h3" /></svg>, accept: '.xls,.xlsx' },
        { label: 'Zip/Folder', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>, accept: '.zip' },
        { label: 'Audio', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>, accept: 'audio/*' },
    ];

    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="p-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {options.map(option => (
                            <button key={option.label} onClick={() => onSelect(option.accept)} className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 aspect-square transition-colors">
                                <span className="text-indigo-500 dark:text-indigo-400">{option.icon}</span>
                                <span className="mt-2 text-sm text-center font-medium text-gray-700 dark:text-gray-200">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CHAT_MESSAGES_KEY = 'mycampus_quickchat_messages';

type TempAttachment = {
    file: File;
    previewUrl: string; // Blob URL for local preview
    type: AttachmentType;
};

const QuickChatPage = ({ currentUser }: { currentUser: User }) => {
    const [messages, setMessages] = useState<QuickChatMessage[]>([]);
    const [rooms, setRooms] = useState<Array<{ id: number; name: string }>>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [inputText, setInputText] = useState('');
    const [attachments, setAttachments] = useState<TempAttachment[]>([]);
    const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'recorded'>('idle');
    const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const typingUsersRef = useRef<Record<string, number>>({});
    const [typingUsersTick, setTypingUsersTick] = useState(0);
    const typingTimeoutRef = useRef<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState<string>('');
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputTextRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, attachments]);

    useEffect(() => {
        const loadRooms = async () => {
            try {
                const rs = await getChatRooms();
                setRooms(rs);
                if (rs.length > 0) setSelectedRoomId(rs[0].id);
            } catch (e) {
                // ignore
            }
        };
        loadRooms();
    }, []);

    const startEdit = (id: number, current: string | undefined) => {
        setEditingId(id);
        setEditText(current ?? '');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const saveEdit = async (id: number) => {
        try {
            await apiEditMessage(id, editText.trim());
            setMessages(prev => prev.map(m => m.id === id ? { ...m, text: editText.trim() } : m));
        } finally {
            cancelEdit();
        }
    };

    const deleteForMe = async (id: number) => {
        try { await apiHideMessage(id, currentUser.id); } catch {}
        setMessages(prev => prev.filter(m => m.id !== id));
    };

    const deleteForEveryone = async (id: number) => {
        try { await deleteMessageApi(id); } catch {}
        setMessages(prev => prev.filter(m => m.id !== id));
    };

    const clearChatForMe = async () => {
        if (!selectedRoomId) return;
        try { await apiClearRoom(selectedRoomId, currentUser.id); } catch {}
        setMessages([]);
    };

    useEffect(() => {
        const loadMessages = async () => {
            if (!selectedRoomId) return;
            try {
                const data = await apiGetMessages(selectedRoomId, { offset: 0, limit: 100, userId: currentUser.id });
                const mapped: QuickChatMessage[] = data.map(m => ({
                    id: m.id,
                    user: { id: m.sender_id, name: m.sender_name },
                    timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    text: m.content,
                }));
                setMessages(mapped);
            } catch (e) {
                setMessages([]);
            }
        };
        loadMessages();
    }, [selectedRoomId]);

    // WebSocket: connect per room, handle message:new and typing events
    useEffect(() => {
        if (!selectedRoomId) return;
        try {
            const apiBase = (import.meta as any).env?.VITE_API_URL as string | undefined;
            const wsBase = apiBase ? apiBase.replace(/^http/, 'ws').replace(/\/api$/, '') : 'ws://localhost:8000';
            const ws = new WebSocket(`${wsBase}/ws/${selectedRoomId}`);
            wsRef.current = ws;
            ws.onmessage = (ev) => {
                try {
                    const msg = JSON.parse(ev.data);
                    if (msg.type === 'message:new' && msg.data) {
                        const m = msg.data;
                        setMessages(prev => {
                            if (prev.some(p => p.id === m.id)) return prev;
                            const mapped: QuickChatMessage = {
                                id: m.id,
                                user: { id: m.sender_id, name: m.sender_name },
                                timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                text: m.content,
                            };
                            return [...prev, mapped];
                        });
                    } else if (msg.type === 'message:edited' && msg.data) {
                        setMessages(prev => prev.map(m => m.id === msg.data.id ? { ...m, text: msg.data.content } : m));
                    } else if (msg.type === 'message:deleted' && msg.id) {
                        setMessages(prev => prev.filter(m => m.id !== msg.id));
                    } else if (msg.type === 'typing:start' || msg.type === 'typing:stop') {
                        const user = msg.user?.name || msg.user?.id;
                        if (!user) return;
                        if (msg.type === 'typing:start') {
                            typingUsersRef.current[user] = Date.now();
                        } else {
                            delete typingUsersRef.current[user];
                        }
                        setTypingUsersTick(t => t + 1);
                    }
                } catch {}
            };
            ws.onclose = () => { wsRef.current = null; };
            return () => {
                try { ws.close(); } catch {}
                wsRef.current = null;
                typingUsersRef.current = {};
                setTypingUsersTick(t => t + 1);
            };
        } catch {}
    }, [selectedRoomId]);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === CHAT_MESSAGES_KEY && event.newValue) {
                try {
                    setMessages(JSON.parse(event.newValue));
                } catch (error) {
                    console.error('Failed to parse messages from storage event', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const getFileType = (file: File): AttachmentType => {
        const type = file.type;
        if (type.startsWith('image/')) return 'image';
        if (type === 'application/zip' || file.name.endsWith('.zip')) return 'zip';
        if (type.startsWith('audio/')) return 'audio';
        return 'document';
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fl: FileList | null = event.target.files as FileList | null;
        if (!fl) return;

        const newAttachments: TempAttachment[] = Array.from(fl).map((file: File) => ({
            file: file,
            previewUrl: URL.createObjectURL(file),
            type: getFileType(file)
        }));
        
        setAttachments(prev => [...prev, ...newAttachments]);
    };
    
    const removeAttachment = (previewUrl: string) => {
        setAttachments(prev => prev.filter(att => {
            const shouldKeep = att.previewUrl !== previewUrl;
            if (!shouldKeep) {
                URL.revokeObjectURL(previewUrl);
            }
            return shouldKeep;
        }));
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() && attachments.length === 0) return;
        if (!selectedRoomId) return;

        const filesToProcess = attachments;
        const textToSend = inputText;

        setInputText('');
        setAttachments([]);

        const fileToDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const processedAttachments: Attachment[] = await Promise.all(
            filesToProcess.map(async (att) => ({
                name: att.file.name,
                dataUrl: await fileToDataUrl(att.file),
                type: att.type,
                mimeType: att.file.type,
                size: att.file.size,
            }))
        );

        // Persist only text content for now
        let savedId = Date.now();
        try {
            if (textToSend.trim()) {
                const saved = await apiSendMessage(selectedRoomId, { sender_id: currentUser.id, sender_name: currentUser.name, content: textToSend.trim() });
                savedId = saved.id;
            }
        } catch (e) {
            // fallback to local append
        }

        const newMessage: QuickChatMessage = {
            id: savedId,
            user: { id: currentUser.id, name: currentUser.name },
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: textToSend.trim() || undefined,
            attachments: processedAttachments.length > 0 ? processedAttachments : undefined,
        };

        setMessages(prev => [...prev, newMessage]);
    };

    // Typing indicator send (debounced stop)
    const notifyTypingStart = () => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        try { ws.send(JSON.stringify({ type: 'typing:start', user: { id: currentUser.id, name: currentUser.name } })); } catch {}
        if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = window.setTimeout(() => {
            try { ws.send(JSON.stringify({ type: 'typing:stop', user: { id: currentUser.id, name: currentUser.name } })); } catch {}
            typingTimeoutRef.current = null;
        }, 1500);
    };
    
    const handleDeleteMessage = (id: number) => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
    };

    const handleMicClick = async () => {
        if (recordingStatus === 'recording') {
            mediaRecorder.current?.stop();
            setRecordingStatus('recorded');
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder.current = new MediaRecorder(stream);
                audioChunks.current = [];

                mediaRecorder.current.ondataavailable = event => {
                    audioChunks.current.push(event.data);
                };

                mediaRecorder.current.onstop = () => {
                    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audioFile = new File([audioBlob], `voice-recording-${Date.now()}.webm`, { type: 'audio/webm' });
                    setAttachments(prev => [...prev, { file: audioFile, previewUrl: audioUrl, type: 'audio' }]);
                    setRecordingStatus('idle');
                    stream.getTracks().forEach(track => track.stop());
                };
                
                mediaRecorder.current.start();
                setRecordingStatus('recording');
            } catch (err) {
                console.error("Error accessing microphone:", err);
                alert("Microphone access was denied. Please allow microphone access in your browser settings.");
                setRecordingStatus('idle');
            }
        }
    };

    const handleAttachmentTypeSelect = (acceptType: string) => {
        const fileInput = fileInputRef.current;
        if (fileInput) {
            fileInput.value = '';
            fileInput.accept = acceptType;
            fileInput.click();
        }
        setIsAttachmentMenuOpen(false);
    };

    const renderAttachmentPreview = () => (
      <div className="p-2 space-y-2">
        {attachments.map(att => {
            const sizeInKB = (att.file.size / 1024).toFixed(1);
            return (
              <div key={att.previewUrl} className="relative flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                {att.type === 'image' && <img src={att.previewUrl} alt={att.file.name} className="w-12 h-12 rounded-md object-cover mr-2" />}
                {att.type === 'audio' && <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 rounded-md mr-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg></div>}
                {(att.type === 'document' || att.type === 'zip') && <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-md mr-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>}
                <div className="flex-1 truncate">
                    <p className="text-sm font-medium truncate">{att.file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sizeInKB} KB</p>
                </div>
                 <button onClick={() => removeAttachment(att.previewUrl)} className="absolute -top-1 -right-1 p-0.5 bg-gray-600 text-white rounded-full hover:bg-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
              </div>
            );
        })}
      </div>
    );
    
    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md relative">
            <header className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Quick Chat</h2>
                <div className="flex items-center gap-2">
                  {rooms.length > 0 && (
                    <select value={selectedRoomId ?? ''} onChange={e => setSelectedRoomId(Number(e.target.value))} className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                        {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  )}
                  <button onClick={clearChatForMe} className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200">Clear Chat</button>
                </div>
            </header>
            <main className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar">
                {messages.length === 0 && <p className="text-center text-gray-400">No messages yet. Start the conversation!</p>}
                {messages.map(msg => {
                    const isMyMessage = msg.user.id === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex items-end gap-2 group ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                            {isMyMessage && 
                              <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500" aria-label="Delete message">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                              </button>
                            }
                            <div className={`max-w-xs lg:max-w-md`}>
                                {!isMyMessage && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-3">{msg.user.name}</p>}
                                <div className={`p-1 rounded-2xl shadow ${isMyMessage ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none'}`}>
                                   <div className="p-2 space-y-2">
                                    {msg.attachments?.map((att, index) => (
                                        <div key={`${att.name}-${index}`}>
                                            {att.type === 'image' && <img src={att.dataUrl} alt={att.name} className="rounded-lg max-w-full h-auto"/>}
                                            {att.type === 'audio' && <audio controls src={att.dataUrl} className="w-full" />}
                                            {(att.type === 'document' || att.type === 'zip') && 
                                                <a href={att.dataUrl} download={att.name} className="flex items-center p-2 bg-indigo-400/50 dark:bg-gray-600 rounded-lg hover:bg-indigo-400/80 dark:hover:bg-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    <span className="truncate text-sm font-medium">{att.name}</span>
                                                </a>
                                            }
                                        </div>
                                    ))}
                                    {editingId === msg.id ? (
                                        <div className="flex items-center gap-2">
                                            <input value={editText} onChange={e => setEditText(e.target.value)} className="flex-1 px-2 py-1 rounded bg-white/90 text-gray-800" />
                                            <button onClick={() => saveEdit(msg.id)} className="px-2 py-1 text-xs bg-green-600 text-white rounded">Save</button>
                                            <button onClick={cancelEdit} className="px-2 py-1 text-xs bg-gray-500 text-white rounded">Cancel</button>
                                        </div>
                                    ) : (
                                        msg.text && <p className="px-2 whitespace-pre-wrap">{msg.text}</p>
                                    )}
                                   </div>
                                    <div className="flex items-center justify-between px-2 pb-1 mt-1">
                                      <span className="text-xs opacity-75">{msg.timestamp}</span>
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                        {isMyMessage && editingId !== msg.id && (
                                            <>
                                              <button onClick={() => startEdit(msg.id, msg.text)} className="text-xs px-2 py-1 rounded bg-white/20 hover:bg-white/30">Edit</button>
                                              <button onClick={() => deleteForMe(msg.id)} className="text-xs px-2 py-1 rounded bg-white/20 hover:bg-white/30">Del me</button>
                                              <button onClick={() => deleteForEveryone(msg.id)} className="text-xs px-2 py-1 rounded bg-white/20 hover:bg-white/30">Del all</button>
                                            </>
                                        )}
                                        {!isMyMessage && (
                                            <button onClick={() => deleteForMe(msg.id)} className="text-xs px-2 py-1 rounded bg-white/20 hover:bg-white/30">Hide</button>
                                        )}
                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </main>
            <footer className="p-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
                {attachments.length > 0 && renderAttachmentPreview()}
                <AttachmentMenuModal 
                    isOpen={isAttachmentMenuOpen} 
                    onClose={() => setIsAttachmentMenuOpen(false)} 
                    onSelect={handleAttachmentTypeSelect} 
                />
                <div className="flex items-end p-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
                    <button onClick={() => setIsAttachmentMenuOpen(true)} className="p-2 text-gray-500 hover:text-indigo-500" aria-label="Attach file">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    </button>
                    <textarea ref={inputTextRef} value={inputText} onChange={e => { setInputText(e.target.value); notifyTypingStart(); }} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder={recordingStatus === 'recording' ? 'Recording audio...' : "Type a message..."} rows={1} className="flex-1 mx-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={recordingStatus === 'recording'}/>
                    
                    {inputText.trim() || attachments.length > 0 ? (
                        <button onClick={handleSendMessage} className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600" aria-label="Send message">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    ) : (
                        <button onClick={handleMicClick} className={`p-2 rounded-full ${recordingStatus === 'recording' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-indigo-500 hover:text-white'}`} aria-label={recordingStatus === 'recording' ? 'Stop recording' : 'Record audio'}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default QuickChatPage;