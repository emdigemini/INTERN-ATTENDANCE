import AddInternForm from '../../components/admin/interns/AddInternForm';
import InternList from '../../components/admin/interns/InternList';

const AddIntern = () => {
  return (
    <main className="h-full bg-gray-50 px-6 overflow-y-auto">
      <div className="grid grid-cols-1 py-4 gap-8 lg:grid-cols-2">
        <AddInternForm />
        <InternList />
      </div>
    </main>
  );
};

export default AddIntern;