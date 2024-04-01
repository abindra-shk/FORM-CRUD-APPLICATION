import React, { useState, useEffect } from 'react';

export function Table({ formSubmitted, onEdit }) {
  const [formEntries, setFormEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const storedEntries = localStorage.getItem('formEntries');
    if (storedEntries) {
      setFormEntries(JSON.parse(storedEntries));
    }
  }, [formSubmitted]);

  const handleEdit = (entry) => {
    // Pass the selected entry to the parent component for editing
    onEdit(entry);
  };

  const handleDelete = (index) => {
    const updatedEntries = [...formEntries];
    updatedEntries.splice(index, 1);
    setFormEntries(updatedEntries);
    localStorage.setItem('formEntries', JSON.stringify(updatedEntries));
  };

  const indexOfLastEntry = currentPage * 5;
  const indexOfFirstEntry = indexOfLastEntry - 5;
  const currentEntries = formEntries.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col w-full justify-center">
      <div className="flex justify-center mt-4">
        {formEntries.length > 5 && (
          <div>
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className='font-bold p-2 underline '>Previous</button>
            <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastEntry >= formEntries.length} className='font-bold p-2 underline'>Next</button>
          </div>
        )}
      </div>
      <div className='flex justify-center p-4'>
      <table className="w-3/5 p-4 border-collapse border border-black">
        <thead>
          <tr>
            <th className="border border-black px-4 py-2">Name</th>
            <th className="border border-black px-4 py-2">Email</th>
            <th className="border border-black px-4 py-2">Phone Number</th>
            <th className="border border-black px-4 py-2">Date of Birth</th>
            <th className="border border-black px-4 py-2">City</th>
            <th className="border border-black px-4 py-2">District</th>
            <th className="border border-black px-4 py-2">Province</th>
            <th className="border border-black px-4 py-2">Country</th>
            <th className="border border-black px-4 py-2">Profile Picture</th>
            <th className="border border-black px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEntries.map((entry, index) => (
            <tr key={index}>
              <td className="border border-black px-4 py-2">{entry.name}</td>
              <td className="border border-black px-4 py-2">{entry.email}</td>
              <td className="border border-black px-4 py-2">{entry.phoneNumber}</td>
              <td className="border border-black px-4 py-2">{entry.dob}</td>
              <td className="border border-black px-4 py-2">{entry.address.city}</td>
              <td className="border border-black px-4 py-2">{entry.address.district}</td>
              <td className="border border-black px-4 py-2">{entry.address.province}</td>
              <td className="border border-black px-4 py-2">{entry.address.country}</td>
              <td className="border border-black px-4 py-2">
                {entry.profilePicture ? (
                  <img src={entry.profilePicture} alt="Profile" className="h-10 w-10" />
                ) : (
                  'N/A'
                )}
              </td>
              <td className="border border-black px-4 py-2">
                <button onClick={() => handleEdit(entry) } className="text-green-500">Edit</button>
                <button onClick={() => handleDelete(indexOfFirstEntry + index)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
    </div>
  );
}
