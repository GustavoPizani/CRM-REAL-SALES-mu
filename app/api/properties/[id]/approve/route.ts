import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getUserFromToken } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se o usuário tem permissão para aprovar (admin ou gerente)
    if (!["marketing_adm", "diretor", "gerente"].includes(user.role)) {
      return NextResponse.json({ error: "Sem permissão para aprovar alterações" }, { status: 403 })
    }

    const { change_ids, action } = await request.json() // action: 'approve' ou 'reject'

    if (action === "approve") {
      // Aplicar as alterações aprovadas
      await sql`
        UPDATE property_changes 
        SET status = 'approved', approved_by = ${user.id}, approved_at = CURRENT_TIMESTAMP
        WHERE id = ANY(${change_ids}) AND property_id = ${params.id}
      `

      // Aqui você aplicaria as alterações na tabela properties
      // Por simplicidade, vamos apenas marcar como aprovado
    } else if (action === "reject") {
      await sql`
        UPDATE property_changes 
        SET status = 'rejected', approved_by = ${user.id}, approved_at = CURRENT_TIMESTAMP
        WHERE id = ANY(${change_ids}) AND property_id = ${params.id}
      `
    }

    return NextResponse.json({ message: `Alterações ${action === "approve" ? "aprovadas" : "rejeitadas"} com sucesso` })
  } catch (error) {
    console.error("Erro ao processar aprovação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
