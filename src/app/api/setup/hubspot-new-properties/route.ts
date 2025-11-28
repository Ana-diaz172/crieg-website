// app/api/setup/hubspot-medical-properties/route.ts
import { NextResponse } from "next/server";

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN!;

interface PropertyDefinition {
    name: string;
    label: string;
    type: string;
    fieldType: string;
    groupName: string;
    description?: string;
}

interface SimplePropertyConfig {
    name: string;
    label?: string;
    description?: string;
}

// Defaults
const DEFAULT_GROUP = "contactinformation";
const DEFAULT_TYPE = "string";
const DEFAULT_FIELD_TYPE = "text";

const simpleProperties: SimplePropertyConfig[] = [
    { name: "active_member", description: "Indica si el contacto es miembro activo" },
    { name: "university", description: "Universidad de estudios profesionales" },
    { name: "specialty", description: "Especialidad principal del profesional" },
    { name: "sub_specialty", description: "Subespecialidad del profesional" },
    { name: "professional_id", description: "Cédula profesional general" },
    { name: "specialty_prof_id", description: "Cédula profesional de especialidad" },
    { name: "sub_specialty_prof_id", description: "Cédula profesional de subespecialidad" },
    { name: "validity_period", description: "Periodo de vigencia de certificaciones o cédulas" },
    { name: "added_certification", description: "Certificaciones adicionales relevantes" },
    { name: "residency_location", description: "Sede o ciudad de residencia médica" },
    { name: "current_residency_year", description: "Año actual de residencia (R1, R2, etc.)" },
    { name: "head_professor_name", description: "Nombre del profesor titular o jefe de enseñanza" },
];

const properties: PropertyDefinition[] = simpleProperties.map((p) => ({
    name: p.name,
    label: p.label ?? p.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    type: DEFAULT_TYPE,
    fieldType: DEFAULT_FIELD_TYPE,
    groupName: DEFAULT_GROUP,
    ...(p.description ? { description: p.description } : {}),
}));

async function createProperty(property: PropertyDefinition) {
    const url = "https://api.hubapi.com/crm/v3/properties/contacts";

    const body: any = {
        name: property.name,
        label: property.label,
        type: property.type,
        fieldType: property.fieldType,
        groupName: property.groupName,
    };

    if (property.description) {
        body.description = property.description;
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        if (data.category === "CONFLICT") {
            return { success: true, exists: true, name: property.name };
        }
        throw new Error(`Failed to create ${property.name}: ${data.message}`);
    }

    return { success: true, created: true, name: property.name, data };
}

export async function POST() {
    if (!HUBSPOT_ACCESS_TOKEN) {
        return NextResponse.json(
            { error: "HUBSPOT_ACCESS_TOKEN not configured" },
            { status: 500 }
        );
    }

    try {
        const results: any[] = [];

        for (const property of properties) {
            try {
                const result = await createProperty(property);
                results.push(result);
                console.log(
                    `✓ ${property.name}:`,
                    (result as any).created ? "created" : "already exists"
                );
            } catch (error: any) {
                console.error(`✗ ${property.name}:`, error.message);
                results.push({
                    success: false,
                    name: property.name,
                    error: error.message,
                });
            }
        }

        const created = results.filter(
            (r) => r.success && (r as any).created === true
        ).length;
        const existed = results.filter(
            (r) => r.success && (r as any).exists === true
        ).length;
        const failed = results.filter((r) => !r.success).length;

        return NextResponse.json({
            success: failed === 0,
            summary: {
                total: properties.length,
                created,
                existed,
                failed,
            },
            results,
        });
    } catch (error: any) {
        console.error("Setup error:", error);
        return NextResponse.json(
            { error: "Setup failed", details: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Use POST to create HubSpot medical contact properties",
        properties: properties.map((p) => ({
            name: p.name,
            label: p.label,
            type: p.type,
        })),
    });
}
