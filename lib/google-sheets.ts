import { google } from 'googleapis'

const GOOGLE_SHEETS_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
const GOOGLE_SHEETS_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID

export async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: GOOGLE_SHEETS_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  return google.sheets({ version: 'v4', auth })
}

export interface SheetLead {
  name: string
  email: string
  phone: string
  campaign: string
  timestamp: string
}

export async function getLeadsFromSheet(): Promise<SheetLead[]> {
  try {
    const sheets = await getGoogleSheetsClient()
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Leads!A2:E', // Nome, Email, Telefone, Campanha, Timestamp
    })

    const rows = response.data.values || []
    
    return rows.map((row: any[]) => ({
      name: row[0] || '',
      email: row[1] || '',
      phone: row[2] || '',
      campaign: row[3] || 'Não informado',
      timestamp: row[4] || new Date().toISOString(),
    }))
  } catch (error) {
    console.error('Error fetching leads from Google Sheets:', error)
    throw error
  }
}
