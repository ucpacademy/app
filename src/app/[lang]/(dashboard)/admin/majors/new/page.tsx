import { NewMajorForm } from './NewMajorForm';

export default function NewMajorPage({ params }: any) {
  // params passed from route, not used inside form
  const lang = params?.lang || 'fr';
  return <NewMajorForm lang={lang} />;
}
