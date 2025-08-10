import { AccessStatus } from '@repo/components/error';

export default function NotFound() {
  return <AccessStatus status="not-found" />;
}
