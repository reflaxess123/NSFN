import { selectCurrentRoomId } from '@/entities/Chat';
import { useAppSelector } from '@/shared/hooks/redux';
import { webSocketService } from '@/shared/services/websocket';
import { Paperclip, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './SendMessageForm.module.scss';

interface SendMessageFormProps {
  onSend?: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const SendMessageForm = ({
  onSend,
  disabled = false,
  placeholder = 'Введите сообщение...',
}: SendMessageFormProps) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<number | undefined>(undefined);

  const currentRoomId = useAppSelector(selectCurrentRoomId);

  // Автоматическое изменение высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Обработка индикатора печати
  const handleTypingStart = () => {
    if (!isTyping && currentRoomId) {
      setIsTyping(true);
      webSocketService.startTyping(currentRoomId);
    }

    // Сбрасываем таймер
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Останавливаем печать через 1 секунду бездействия
    typingTimeoutRef.current = window.setTimeout(() => {
      if (currentRoomId) {
        setIsTyping(false);
        webSocketService.stopTyping(currentRoomId);
      }
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    handleTypingStart();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled || !currentRoomId) return;

    // Отправляем сообщение через WebSocket
    webSocketService.sendMessage({
      roomId: currentRoomId,
      content: trimmedMessage,
      messageType: 'TEXT',
    });

    // Останавливаем индикатор печати
    if (isTyping) {
      setIsTyping(false);
      webSocketService.stopTyping(currentRoomId);
    }

    // Очищаем форму
    setMessage('');

    // Вызываем callback если передан
    onSend?.(trimmedMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form className={styles.sendMessageForm} onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <button
          type="button"
          className={styles.attachButton}
          disabled={disabled}
          aria-label="Прикрепить файл"
        >
          <Paperclip size={20} />
        </button>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.messageInput}
          rows={1}
          maxLength={1000}
        />

        <button
          type="submit"
          className={styles.sendButton}
          disabled={disabled || !message.trim()}
          aria-label="Отправить сообщение"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};
