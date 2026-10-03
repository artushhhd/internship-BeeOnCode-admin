import Switch from '@mui/material/Switch';
import { useTranslation } from 'react-i18next';

const SwitchController = ({
  checked,
  setChecked,
  children,
  labels: { first, second },
  disabled = false,
}) => {
  const { t } = useTranslation('navigation');

  return (
    <>
      <div className="flex items-center mt-20 w-full">
        <span style={{ opacity: checked && 0.3 }}>{t(first)}</span>
        <Switch
          disabled={disabled}
          checked={checked}
          onChange={(ev) => setChecked(ev.target.checked)}
          aria-label="checked"
        />
        <span style={{ opacity: !checked && 0.3 }}>{t(second)}</span>
      </div>
      {children}
    </>
  );
};

export default SwitchController;
