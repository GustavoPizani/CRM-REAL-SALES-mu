import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const changes = await sql`
      SELECT 
        pc.*,
        u.name as user_name,
        approver.name as approved_by_name
      FROM property_changes pc
      LEFT JOIN users u ON pc.user_id = u.id
      LEFT JOIN users approver ON pc.approved_by = approver.id
      WHERE pc.property_id = ${params.id}
      ORDER BY pc.created_at DESC
    `

    return NextResponse.json(changes)
  } catch (error) {
    console.error("Error fetching property changes:", error)
    return NextResponse.json({ error: "Failed to fetch changes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { field, oldValue, newValue, userId } = body

    // Insert change record
    const [change] = await sql`
      INSERT INTO property_changes (
        property_id, user_id, field, old_value, new_value, status
      ) VALUES (
        ${params.id}, ${userId}, ${field}, ${JSON.stringify(oldValue)}, ${JSON.stringify(newValue)}, 'pending'
      )
      RETURNING *
    `

    return NextResponse.json(change)
  } catch (error) {
    console.error("Error creating property change:", error)
    return NextResponse.json({ error: "Failed to create change" }, { status: 500 })
  }
}
