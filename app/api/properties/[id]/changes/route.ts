import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const changes = await sql`
      SELECT 
        pc.*,
        u.name as user_name
      FROM property_changes pc
      LEFT JOIN users u ON pc.user_id = u.id
      WHERE pc.property_id = ${params.id}
      ORDER BY pc.created_at DESC
      LIMIT 50
    `

    return NextResponse.json(changes)
  } catch (error) {
    console.error("Erro ao buscar histórico de alterações:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { field, old_value, new_value, change_type = "update" } = await request.json()

    const result = await sql`
      INSERT INTO property_changes (
        property_id, user_id, field, old_value, new_value, change_type
      )
      VALUES (
        ${params.id}, ${user.id}, ${field}, ${JSON.stringify(old_value)}, 
        ${JSON.stringify(new_value)}, ${change_type}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Erro ao registrar alteração:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
