"use client";

import { useState } from "react";
import { SearchBar } from "@/components/ui/searchbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AddDoctorDialog from "./AddDoctorDialog";

export default function Doctors() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="pt-20 pl-52">
      <h1 className="text-3xl font-bold">Doctors</h1>
      <div className="mt-4 flex items-center justify-between">
        <SearchBar />
        <div className="flex items-center space-x-4 p-4">
          <Button className="bg-white border text-[#101828] hover:bg-[#f0f0f0] flex items-center space-x-2">
            <Image
              src="/filter-lines.svg"
              alt="filter icon"
              width={20}
              height={20}
            />
            <span>Filter</span>
          </Button>

          <AddDoctorDialog onClose={handleDialogClose} />
        </div>
      </div>
    </div>
  );
}
