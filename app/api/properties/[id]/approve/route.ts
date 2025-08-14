import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { changeId, action, userId } = body // action: 'approve' or 'reject'

    if (action === "approve") {
      // Get the change details
      const [change] = await sql`
        SELECT * FROM property_changes 
        WHERE id = ${changeId} AND property_id = ${params.id}
      `

      if (!change) {
        return NextResponse.json({ error: "Change not found" }, { status: 404 })
      }

      // Apply the change to the property
      const field = change.field
      const newValue = change.new_value

      // Build dynamic update query based on field
      let updateQuery = ""
      let updateValue = newValue

      switch (field) {
        case "title":
          updateQuery = "UPDATE properties SET title = $1 WHERE id = $2"
          break
        case "description":
          updateQuery = "UPDATE properties SET description = $1 WHERE id = $2"
          break
        case "address":
          updateQuery = "UPDATE properties SET address = $1 WHERE id = $2"
          break
        case "city":
          updateQuery = "UPDATE properties SET city = $1 WHERE id = $2"
          break
        case "state":
          updateQuery = "UPDATE properties SET state = $1 WHERE id = $2"
          break
        case "zipCode":
          updateQuery = "UPDATE properties SET zip_code = $1 WHERE id = $2"
          break
        case "propertyType":
          updateQuery = "UPDATE properties SET property_type = $1 WHERE id = $2"
          break
        case "status":
          updateQuery = "UPDATE properties SET status = $1 WHERE id = $2"
          break
        case "totalUnits":
          updateQuery = "UPDATE properties SET total_units = $1 WHERE id = $2"
          updateValue = Number.parseInt(newValue)
          break
        case "deliveryDate":
          updateQuery = "UPDATE properties SET delivery_date = $1 WHERE id = $2"
          break
        case "developerName":
          updateQuery = "UPDATE properties SET developer_name = $1 WHERE id = $2"
          break
        case "partnershipManager":
          updateQuery = "UPDATE properties SET partnership_manager = $1 WHERE id = $2"
          break
        case "typologies":
          updateQuery = "UPDATE properties SET typologies = $1 WHERE id = $2"
          updateValue = JSON.stringify(newValue)
          break
        case "images":
          updateQuery = "UPDATE properties SET images = $1 WHERE id = $2"
          updateValue = JSON.stringify(newValue)
          break
        default:
          return NextResponse.json({ error: "Invalid field" }, { status: 400 })
      }

      // Apply the change
      await sql.query(updateQuery, [updateValue, params.id])

      // Update change status
      await sql`
        UPDATE property_changes 
        SET status = 'approved', approved_by = ${userId}, approved_at = NOW()
        WHERE id = ${changeId}
      `
    } else if (action === "reject") {
      // Just update the change status
      await sql`
        UPDATE property_changes 
        SET status = 'rejected', approved_by = ${userId}, approved_at = NOW()
        WHERE id = ${changeId}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing approval:", error)
    return NextResponse.json({ error: "Failed to process approval" }, { status: 500 })
  }
}
