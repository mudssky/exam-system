-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "isPublish" BOOLEAN NOT NULL DEFAULT false,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL,
    "createUserId" TEXT NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_createUserId_fkey" FOREIGN KEY ("createUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
