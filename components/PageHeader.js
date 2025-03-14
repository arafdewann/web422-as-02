import { Card } from "react-bootstrap";

export default function PageHeader({ text }) {
  return (
    <>
      <Card className="bg-light">
        <Card.Body>{text}</Card.Body>
      </Card>
      <br />
    </>
  );
}
