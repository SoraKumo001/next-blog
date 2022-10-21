import { SystemButton } from '@/components/Commons/SystemButton';
import React, { FC } from 'react';
import IconSetting from '@mui/icons-material/Settings';
import { useAdmin } from '@/hooks/useAdmin';
interface Props { }

/**
 * Settings
 *
 * @param {Props} { }
 */
export const Settings: FC<Props> = ({ }) => {
  const isAdmin = useAdmin();
  if (!isAdmin) return null;
  return (
    <SystemButton icon={<IconSetting />} href="/settings">
      Setting
    </SystemButton>
  );
};
