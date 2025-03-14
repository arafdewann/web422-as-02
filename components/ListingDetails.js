import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";

export default function ListingDetails({ listing }) {
  if (!listing) return <p>⚠️ No listing data available.</p>;

  // Extract values
  const imageUrl =
    listing.picture_url || "https://placehold.co/600x400?text=No+Image";
  const price = listing.price?.$numberInt || "N/A";
  const beds = listing.beds?.$numberInt || "N/A";

  return (
    <Container>
      <Row>
        <Col lg>
          <img
            onError={(event) => {
              event.target.onerror = null;
              event.target.src = "https://placehold.co/600x400?text=No+Image";
            }}
            className="img-fluid w-100"
            src={imageUrl}
            alt="Listing Image"
            width={500}
            height={300}
          />
          <br />
          <br />
        </Col>
        <Col lg>
          <p>
            <strong>Location:</strong> {listing.location || "N/A"}
          </p>
          <p>
            <strong>Neighborhood:</strong>{" "}
            {listing.neighborhood_overview || "N/A"}
          </p>
          <p>
            <strong>Price:</strong> ${listing.price}
          </p>
          <p>
            <strong>Room Type:</strong> {listing.room_type}
          </p>
          <p>
            <strong>Bed Type:</strong> {listing.bed_type} ({listing.beds} beds)
          </p>
        </Col>
      </Row>
    </Container>
  );
}
