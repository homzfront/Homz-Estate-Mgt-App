export interface Resident {
    name: string;
    zone: string;
    street: string;
    building: string;
    apartment: string;
    email: string;
    phone: string;
    image: string;
}

// Actual entries from image
export const residents: Resident[] = [
    {
        name: "Adeyemo Olayemi",
        zone: "(Zone Name)",
        street: "[Street Name]",
        building: "[Building Name]",
        apartment: "[Apartment Name/No.]",
        email: "AdeyemoOloyemiAdmin400@gmail.com",
        phone: "0801 000 0000",
        image: "/resident-images/adeyemo-olayemi.jpg"
    },
    {
        name: "Goinbo Diongoli",
        zone: "N/A",
        street: "Adegbole Street",
        building: "White House",
        apartment: "Apartment 4",
        email: "Gonibo14@gmail.com",
        phone: "0801 234 768",
        image: "/resident-images/goinbo-diongoli.jpg"
    },
    {
        name: "Amina Umar",
        zone: "Zone B",
        street: "Sylvester Street",
        building: "Greenland",
        apartment: "Apartment 16",
        email: "Amina.Umar@gmail.com",
        phone: "0801 000 0000",
        image: "/resident-images/amina-umar.jpg"
    },
    {
        name: "Uchenna Eze",
        zone: "Zone B",
        street: "Sylvester Street",
        building: "Greenland",
        apartment: "Apartment 1",
        email: "Uchenna@yahoo.com",
        phone: "0801 234 768",
        image: "/resident-images/uchenna-eze.jpg"
    },
    {
        name: "Chinonso Anyaoku",
        zone: "Zone B",
        street: "McRing Street",
        building: "Greenland",
        apartment: "Apartment 16",
        email: "ChisomAyuska@gmail.com",
        phone: "0801 000 0000",
        image: "/resident-images/chinonso-anyaoku.jpg"
    },
    {
        name: "Chidinma Obi",
        zone: "N/A",
        street: "Adegbole Street",
        building: "Greenland",
        apartment: "Apartment 9",
        email: "Chidinma.Obi@gmail.com",
        phone: "0801 234 768",
        image: "/resident-images/chidinma-obi.jpg"
    },
    {
        name: "Kelechi Eze.",
        zone: "Zone B",
        street: "Sylvester Street",
        building: "Greenland",
        apartment: "Apartment 5",
        email: "KelechiM.S@gmail.com",
        phone: "0801 000 0000",
        image: "/resident-images/kelechi-eze.jpg"
    },
    {
        name: "Femi Jegede",
        zone: "Zone B",
        street: "McRing Street",
        building: "Greenland",
        apartment: "Apartment 8",
        email: "Jagede258@gmail.com",
        phone: "0801 234 768",
        image: "/resident-images/femi-jegede.jpg"
    },
    {
        name: "Ngozi Nnechukwu",
        zone: "Zone B",
        street: "McRing Street",
        building: "Greenland",
        apartment: "Apartment 4",
        email: "Nnechukwu43@gmail.com",
        phone: "0801 000 0000",
        image: "/resident-images/ngozi-nnechukwu.jpg"
    },
];

// Dummy entries
const dummyResidents: Resident[] = Array.from({ length: 32 }, (_, i): Resident => ({
    name: `Dummy User ${i + 1}`,
    zone: `Zone ${i % 4 === 0 ? "A" : i % 4 === 1 ? "B" : "C"}`,
    street: `Dummy Street ${i + 1}`,
    building: `Building ${i + 1}`,
    apartment: `Apartment ${i + 1}`,
    email: `dummy${i + 1}@example.com`,
    phone: `0801 000 00${(i + 1).toString().padStart(2, "0")}`,
    image: "/AvatarEmpty.png"
}));

// Final dataset
export const allResidents: Resident[] = [...residents, ...dummyResidents];
