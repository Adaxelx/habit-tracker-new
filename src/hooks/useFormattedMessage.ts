import { useIntl } from 'react-intl';

export default function useFormattedMessage(
  messageId: string | number,
  params: Record<string, any> = {}
) {
  return useIntl().formatMessage(
    { id: typeof messageId === 'number' ? messageId.toString() : messageId },
    params
  );
}
