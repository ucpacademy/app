import { NewBranchForm } from './NewBranchForm';

export default function NewBranchPage({ params }: any) {
  const lang = params?.lang || 'fr';
  const search = params?.search || null;
  const initialMajorId =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('major_id') || ''
      : '';

  return <NewBranchForm lang={lang} initialMajorId={initialMajorId} />;
}
