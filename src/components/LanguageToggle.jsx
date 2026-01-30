import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RAIM_COLORS } from '../constants';

const getStyles = (isMobile, inline) => ({
  languageToggle: {
    position: inline ? 'relative' : 'fixed',
    top: inline ? 'auto' : (isMobile ? '80px' : '38px'),
    right: inline ? 'auto' : (isMobile ? '14px' : '160px'),
    zIndex: inline ? 'auto' : 999,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: isMobile ? '12px 10px' : '14px 22px',
    borderRadius: '32px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: `1px solid ${RAIM_COLORS.BG}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)'
  },
  languageText: {
    fontSize: isMobile ? '15px' : '24px',
    fontWeight: '600',
    color: RAIM_COLORS.DARK,
    userSelect: 'none'
  }
});

export default function LanguageToggle({ isMobile = false, inline = false }) {
  const { i18n } = useTranslation();
  const styles = getStyles(isMobile, inline);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <div 
      style={styles.languageToggle}
      onClick={toggleLanguage}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
    >
      <Languages size={15} color={RAIM_COLORS.DARK} />
      <span style={styles.languageText}>
        {i18n.language === 'ko' ? 'EN' : '한글'}
      </span>
    </div>
  );
}
