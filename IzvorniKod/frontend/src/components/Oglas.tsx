import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./Oglas.css";

interface CardProps {
    id: number;
    title: string;
    species: string;
    color: string;
    age: number;
    shelterName: string | null;
    loggedInUsername: string;
    username: string;
    showDeleteButton: boolean;
    onDelete: (id: number) => void;
    showChangeButton: boolean;
    onChange: (id: number) => void;
}

const Oglas: React.FC<CardProps> = ({
                                        id,
                                        title,
                                        species,
                                        color,
                                        age,
                                        shelterName,
                                        loggedInUsername,
                                        username,
                                        showDeleteButton,
                                        onDelete,
                                        showChangeButton,
                                        onChange,
                                    }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isChanging, setIsChanging] = useState(false);
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    const navigate = useNavigate();

    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/api/advertisements/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setIsDeleting(true);
                onDelete(id);
            } else {
                console.error("Failed to delete advertisement");
            }
        } catch (error) {
            console.error("Error deleting advertisement:", error);
        }
    };

    const handleChangeClick = () => {
        navigate(`/changeAd/${id}`);
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsCardFlipped(!isCardFlipped);
    };

    return (
        <div>
            <Link to={`/${id}`}>
                <div className={`card cardContainer ${isCardFlipped ? "flipped" : ""}`}>
                    <div className="card-body cardBody">
                        {!isCardFlipped && (
                            <div className="flip-card-front">
                                <h5 className="card-title cardTitle">{title}</h5>
                            </div>
                        )}
                        {isCardFlipped && (
                            <div className="flip-card-back">
                                <p className="card-text cardText">Vrsta: {species}</p>
                                <p className="card-text cardText">Boja: {color}</p>
                                <p className="card-text cardText">Starost: {age}</p>
                                {shelterName !== null && (
                                    <p className="card-text cardText additional-info">
                                        Naziv skloništa: {shelterName}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    <button className="btn btn-success" onClick={handleButtonClick}>
                        {isCardFlipped ? "Povratak" : "Detalji"}
                    </button>
                </div>
            </Link>
            {showDeleteButton && loggedInUsername === username && (
                <div className="d-grid w-50 mx-auto mt-2">
                    <button
                        className="btn btn-danger"
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Završite brisanje" : "Izbrišite oglas"}
                    </button>
                </div>
            )}
            {showChangeButton && loggedInUsername === username && (
                <div className="d-grid w-50 mx-auto mt-2">
                    <button
                        className="btn btn-primary"
                        onClick={handleChangeClick}
                        disabled={isChanging}
                    >
                        {isChanging ? "Završite izmjenu" : "Izmijenite oglas"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Oglas;