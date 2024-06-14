import "../styles/style.css";
import React from "react";

const cscsCards = [
  {
    image: "",
    title: "Green Labourer CSCS Card",
    description:
      "Requires passing the Operatives Test and completing the QCF Level 1/SCQF Level 4 Award in Health and Safety. If not completed, apply for a Provisional CSCS Card.",
  },
  {
    title: "Blue Skilled CSCS Card",
    description:
      "Requires passing the relevant CITB Health, Safety & Environment Test and having a SVQ/NVQ level 2 or City and Guilds Craft Certificate. Valid for 5 years.",
  },
  {
    title: "Gold Advanced Craft CSCS Card",
    description:
      "Requires passing the relevant CITB test and having a Construction NVQ/SVQ level 3 or an approved apprenticeship. Valid for advanced craft workers.",
  },
  {
    title: "Gold Supervisor CSCS Card",
    description:
      "Requires passing the Supervisor Test and having a Construction Supervisory NVQ/SVQ level 3 or 4. For those in supervisory roles.",
  },
  {
    title: "Black Manager CSCS Card",
    description:
      "Requires passing the Managers & Professionals (MAP) Test and having NVQ/SVQ levels 5, 6, or 7 in construction management.",
  },
  {
    title: "Red Provisional CSCS Card",
    description:
      "Requires passing the Operatives Test. Valid for 6 months and cannot be renewed. For those new to CSCS cards.",
  },
  {
    title: "Red Experienced Worker CSCS Card",
    description:
      "Requires passing the relevant CITB test and being registered for a Construction NVQ/SVQ. Valid for 1 year and not renewable.",
  },
  {
    title: "Red Experienced Technical, Supervisory and Management CSCS Card",
    description:
      "For experienced supervisors/managers without NVQ/SVQ level 3 or higher. Valid for 3 years, requires registration for a relevant NVQ/SVQ.",
  },
  {
    title: "Red Trainee CSCS Card",
    description:
      "For those registered for but not yet achieved NVQ/SVQ level 2 or 3. For those in further education for a construction qualification.",
  },
  {
    title: "Red Apprentice CSCS Card",
    description:
      "Requires passing the Operatives Test. For those starting or about to start a recognized apprenticeship. Valid for 4 years and 6 months, non-renewable.",
  },
  {
    title: "White Professionally Qualified Person CSCS Card",
    description:
      "Requires passing the Managers & Professionals (MAP) Test. For professionals with general health and safety roles, members of CSCS approved bodies.",
  },
  {
    title: "White Academically Qualified Person CSCS Card",
    description:
      "Requires passing the Managers & Professionals (MAP) Test. For those with construction-related degrees, HNDs, HNCs, CIOB Certificates, or NEBOSH diplomas.",
  },
];

const Cards = () => {
  return (
    <>
      <div className="cardsintro">
        <h1 className="cardsheading">CSCS Cards</h1>
        <p>
          This is the cards page, here you will find information on all of the
          available CSCS cards and how to obtain them, you can book for these
          specific cards depending on your NVQ status.
        </p>
      </div>
      <div className="cardscontainer">
        {cscsCards.map((card, index) => (
          <div className="card" key={index}>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Cards;
