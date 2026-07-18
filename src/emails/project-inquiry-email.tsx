import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ProjectInquiryEmailProps {
  name: string;
  email: string;
  company?: string;
  brief: string;
}

export function ProjectInquiryEmail({
  name,
  email,
  company,
  brief,
}: ProjectInquiryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New project enquiry from {name}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>VASTOS</Text>
          <Heading style={styles.heading}>New project enquiry</Heading>
          <Text style={styles.intro}>
            A new enquiry was submitted through the VASTOS website.
          </Text>
          <Hr style={styles.rule} />
          <Section>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{name}</Text>
            <Text style={styles.label}>Work email</Text>
            <Text style={styles.value}>{email}</Text>
            <Text style={styles.label}>Company</Text>
            <Text style={styles.value}>{company || "Not provided"}</Text>
            <Text style={styles.label}>Project brief</Text>
            <Text style={styles.brief}>{brief}</Text>
          </Section>
          <Hr style={styles.rule} />
          <Text style={styles.footer}>
            Reply to this email to contact {name} directly.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#0a0d0b",
    color: "#eef2ed",
    fontFamily: "Arial, Helvetica, sans-serif",
    margin: 0,
    padding: "32px 12px",
  },
  container: {
    backgroundColor: "#111612",
    border: "1px solid #273028",
    borderRadius: "10px",
    margin: "0 auto",
    maxWidth: "600px",
    padding: "36px",
  },
  brand: {
    color: "#9ddc68",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.18em",
    margin: "0 0 22px",
  },
  heading: {
    color: "#f2f4f1",
    fontSize: "30px",
    fontWeight: "600",
    letterSpacing: "-0.03em",
    margin: "0 0 12px",
  },
  intro: {
    color: "#aeb8af",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: 0,
  },
  rule: {
    borderColor: "#273028",
    margin: "30px 0",
  },
  label: {
    color: "#7f8b81",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.12em",
    margin: "20px 0 5px",
    textTransform: "uppercase" as const,
  },
  value: {
    color: "#f2f4f1",
    fontSize: "16px",
    lineHeight: "1.5",
    margin: 0,
  },
  brief: {
    color: "#f2f4f1",
    fontSize: "16px",
    lineHeight: "1.7",
    margin: 0,
    whiteSpace: "pre-wrap" as const,
  },
  footer: {
    color: "#7f8b81",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: 0,
  },
};
