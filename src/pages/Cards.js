import "../styles/card.css";
import React from "react";
import greenLabourerCSCSCard from "../images/green-labourer-cscs-card.webp";
import blueSkilledCSCSCard from "../images/blue-skilled-worker-cscs-card.webp";
import goldAdvancedCraftCSCSCard from "../images/gold-advanced-craft-cscs-card.webp";
import goldSupervisorCSCSCard from "../images/gold-supervisor-cscs-card.webp";
import blackManagerCSCSCard from "../images/black-manager-cscs-card.webp";
import redProvisionalCSCSCard from "../images/red-provisional-cscs-card.webp";
import redExperiencedWorkerCSCSCard from "../images/red-experienced-worker-cscs-card.webp";
import redExpTechSuperManageCSCSCard from "../images/red-experienced-technical-cscs-card.webp";
import redTraineeCSCSCard from "../images/red-trainee-cscs-card.webp";
import redApprenticeCSCSCard from "../images/red-apprentice-cscs-card.webp";
import whiteProfQualCSCSCard from "../images/white-pqp-cscs-card.webp";
import whiteAcademicQualCSCSCard from "../images/white-aqp-cscs-card.webp";

const cscsCards = [
  {
    image: greenLabourerCSCSCard,
    title: "Green Labourer CSCS Card",
    description:
      "Requires passing the Operatives Test and completing the QCF Level 1/SCQF Level 4 Award in Health and Safety. If not completed, apply for a Provisional CSCS Card.",
  },
  {
    image: blueSkilledCSCSCard,
    title: "Blue Skilled CSCS Card",
    description:
      "Requires passing the relevant CITB Health, Safety & Environment Test and having a SVQ/NVQ level 2 or City and Guilds Craft Certificate. Valid for 5 years.",
  },
  {
    image: goldAdvancedCraftCSCSCard,
    title: "Gold Advanced Craft CSCS Card",
    description:
      "Requires passing the relevant CITB test and having a Construction NVQ/SVQ level 3 or an approved apprenticeship. Valid for advanced craft workers.",
  },
  {
    image: goldSupervisorCSCSCard,
    title: "Gold Supervisor CSCS Card",
    description:
      "Requires passing the Supervisor Test and having a Construction Supervisory NVQ/SVQ level 3 or 4. For those in supervisory roles.",
  },
  {
    image: blackManagerCSCSCard,
    title: "Black Manager CSCS Card",
    description:
      "Requires passing the Managers & Professionals (MAP) Test and having NVQ/SVQ levels 5, 6, or 7 in construction management.",
  },
  {
    image: redProvisionalCSCSCard,
    title: "Red Provisional CSCS Card",
    description:
      "Requires passing the Operatives Test. Valid for 6 months and cannot be renewed. For those new to CSCS cards.",
  },
  {
    image: redExperiencedWorkerCSCSCard,
    title: "Red Experienced Worker CSCS Card",
    description:
      "Requires passing the relevant CITB test and being registered for a Construction NVQ/SVQ. Valid for 1 year and not renewable.",
  },
  {
    image: redExpTechSuperManageCSCSCard,
    title: "Red Experienced Technical, Supervisory and Management CSCS Card",
    description:
      "For experienced supervisors/managers without NVQ/SVQ level 3 or higher. Valid for 3 years, requires registration for a relevant NVQ/SVQ.",
  },
  {
    image: redTraineeCSCSCard,
    title: "Red Trainee CSCS Card",
    description:
      "For those registered for but not yet achieved NVQ/SVQ level 2 or 3. For those in further education for a construction qualification.",
  },
  {
    image: redApprenticeCSCSCard,
    title: "Red Apprentice CSCS Card",
    description:
      "Requires passing the Operatives Test. For those starting or about to start a recognized apprenticeship. Valid for 4 years and 6 months, non-renewable.",
  },
  {
    image: whiteProfQualCSCSCard,
    title: "White Professionally Qualified Person CSCS Card",
    description:
      "Requires passing the Managers & Professionals (MAP) Test. For professionals with general health and safety roles, members of CSCS approved bodies.",
  },
  {
    image: whiteAcademicQualCSCSCard,
    title: "White Academically Qualified Person CSCS Card",
    description:
      "Requires passing the Managers & Professionals (MAP) Test. For those with construction-related degrees, HNDs, HNCs, CIOB Certificates, or NEBOSH diplomas.",
  },
];

const Cards = () => {
  return (
    <>
      <div className="cardsbackground">
        <div className="cardsintro">
          <h1 className="cardsheading">CSCS Cards</h1>
          <p className="cardstext">
            This is the cards page, here you will find information on all of the
            available CSCS cards and how to obtain them, you can book for these
            specific cards depending on your NVQ status.
          </p>
        </div>
        <div className="cardscontainer">
          {cscsCards.map((card, index) => (
            <div className="card" key={index}>
              <img src={card.image} alt={card.title} className="cardimage" />
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Cards;
