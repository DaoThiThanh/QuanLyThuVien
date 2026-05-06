import React, { useState } from 'react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import type { EmojiClickData } from 'emoji-picker-react';
import styles from './MetadataModal.module.css';

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, icon?: string) => void;
  title: string;
  placeholder: string;
  showIconField?: boolean;
  initialValue?: string;
  initialIcon?: string;
}

const MetadataModal: React.FC<MetadataModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  placeholder,
  showIconField = false,
  initialValue = '',
  initialIcon = '📁'
}) => {
  const [name, setName] = useState(initialValue);
  const [icon, setIcon] = useState(initialIcon);
  const [showPicker, setShowPicker] = useState(false);

  // Cập nhật state khi props thay đổi (đặc biệt quan trọng khi chuyển từ Thêm sang Sửa)
  React.useEffect(() => {
    if (isOpen) {
      setName(initialValue);
      setIcon(initialIcon);
    }
  }, [isOpen, initialValue, initialIcon]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name, icon);
      setName('');
      setIcon('');
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.body}>
          <div className={styles.formGroup}>
            <label>Tên gọi <span className={styles.required}>*</span></label>
            <input
              type="text"
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={placeholder}
              className={styles.input}
            />
          </div>
          {showIconField && (
            <div className={styles.formGroup}>
              <label>Icon hiển thị</label>
              <div className={styles.emojiSelector}>
                <button 
                  type="button" 
                  className={styles.emojiBtn}
                  onClick={() => setShowPicker(!showPicker)}
                >
                  <span className={styles.currentEmoji}>{icon}</span>
                  <span className={styles.emojiLabel}>Chọn Emoji</span>
                </button>
                
                {showPicker && (
                  <div className={styles.pickerContainer}>
                    <div className={styles.pickerOverlay} onClick={() => setShowPicker(false)} />
                    <div className={styles.pickerWrapper}>
                      <EmojiPicker 
                        onEmojiClick={(emojiData: EmojiClickData) => {
                          setIcon(emojiData.emoji);
                          setShowPicker(false);
                        }}
                        autoFocusSearch={false}
                        theme={Theme.LIGHT}
                        width="100%"
                        height="350px"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Hủy</button>
            <button type="submit" className={styles.saveBtn} disabled={!name.trim()}>Lưu lại</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MetadataModal;
