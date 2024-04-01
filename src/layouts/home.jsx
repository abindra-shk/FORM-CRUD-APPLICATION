import { Form } from "../components/modules/form";
import { Table } from "../components/modules/table";
import { useState } from "react";

export function Home() {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

    const handleFormSubmit = () => {
        // Set formSubmitted to true to trigger a re-render of the Table component
        setFormSubmitted(true);
    };

    const handleEdit = (entry) => {
        // Set the selected entry for editing
        setSelectedEntry(entry);
      };

    return (
       <div className="w-full h-full">
        <Form onFormSubmit={handleFormSubmit} selectedEntry={selectedEntry}/>
        <Table formSubmitted={formSubmitted} onEdit={handleEdit}/>
       </div>
    );
}