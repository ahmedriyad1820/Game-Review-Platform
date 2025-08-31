import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/reports/[id]/status - Update report status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status } = body

    // Validate status
    if (!['PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be PENDING, INVESTIGATING, RESOLVED, or DISMISSED' },
        { status: 400 }
      )
    }

    // Check if report exists
    const existingReport = await prisma.report.findUnique({
      where: { id },
    })

    if (!existingReport) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    // Update the report status
    const report = await prisma.report.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({
      message: `Report status updated to ${status}`,
      report,
    })
  } catch (error) {
    console.error('Error updating report status:', error)
    return NextResponse.json(
      { error: 'Failed to update report status' },
      { status: 500 }
    )
  }
}
