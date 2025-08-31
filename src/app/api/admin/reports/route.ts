import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/reports - List all reports
export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    })

    // Enrich reports with target content information
    const enrichedReports = await Promise.all(
      reports.map(async (report) => {
        let targetContent = null

        try {
          switch (report.targetType) {
            case 'REVIEW':
              const review = await prisma.review.findUnique({
                where: { id: report.targetId },
                select: {
                  rating: true,
                  bodyMd: true,
                },
              })
              if (review) {
                targetContent = {
                  rating: review.rating,
                  content: review.bodyMd,
                }
              }
              break

            case 'USER':
              const user = await prisma.user.findUnique({
                where: { id: report.targetId },
                select: {
                  username: true,
                },
              })
              if (user) {
                targetContent = {
                  username: user.username,
                }
              }
              break

            case 'GAME':
              const game = await prisma.game.findUnique({
                where: { id: report.targetId },
                select: {
                  title: true,
                },
              })
              if (game) {
                targetContent = {
                  title: game.title,
                }
              }
              break

            case 'COMMENT':
              const comment = await prisma.comment.findUnique({
                where: { id: report.targetId },
                select: {
                  content: true,
                },
              })
              if (comment) {
                targetContent = {
                  content: comment.content,
                }
              }
              break
          }
        } catch (error) {
          console.error(`Error fetching target content for report ${report.id}:`, error)
        }

        return {
          ...report,
          targetContent,
        }
      })
    )

    return NextResponse.json(enrichedReports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}
