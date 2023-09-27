import { json } from '@remix-run/node';
import { db } from '~/libs/prisma/db.server';

// Fetching data store, bankAccount, withdraw
export async function getStoreData(id: string) {
  return json(
    await db.store.findMany({
      where: {
        id: '1',
      },
      include: {
        bankAccounts: {
          include: {
            withdraws: {
              where: {
                storeId: '1',
              },
            },
          },
        },
      },
    })
  );
}

//BankAccount CRUD
export async function getBankList(storeId: string) {
  return json(
    await db.bankAccount.findMany({
      where: {
        storeId: '1',
      },
    })
  );
}

export async function deleteBankList(id: string) {
  await db.withdraw.updateMany({
    where: { bankId: id },
    data: { bankId: null || undefined },
  });

  await db.bankAccount.delete({
    where: { id: id },
  });
  return { success: true };
}

export async function getNameBank(bank: string) {
  return await db.bankAccount.findFirst({
    where: {
      bank: bank,
    },
  });
}

export async function createBank(data: any) {
  const createdBank = await db.bankAccount.create({
    data: {
      store: {
        connect: { id: '1' },
      },
      accountName: data.accountName,
      bank: data.bank,
      accountNumber: data.accountNumber,
    },
  });

  return createdBank;
}

export async function updateBank(
  Id: string,
  updateAccountName: string,
  updateBankName: string,
  updateAccountNumber: string
) {
  try {
    const updatedBank = await db.bankAccount.update({
      where: {
        id: Id,
      },
      data: {
        accountName: updateAccountName,
        bank: updateBankName,
        accountNumber: updateAccountNumber,
      },
    });
    return updatedBank;
  } catch (error) {
    console.error('error updating', error);
    throw error;
  }
}

//Withdraw
export async function getWithdrawalList() {
  const withdrawalList = await db.withdraw.findMany({
    include: {
      store: true,
      bankAccount: true,
      attachmentAdmin: true,
      adminDecline: true,
    },
  });

  return withdrawalList;
}

export async function updateStatusWithdraw(
  id: string,
  statusUpdated: string,
  dateUpdated?: string
) {
  try {
    const updatedStatus = await db.withdraw.update({
      where: {
        id: id,
      },
      data: {
        status: statusUpdated,
        updatedAt: dateUpdated,
      },
    });
    return updatedStatus;
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
}

export async function createWithdraw(
  data: any,
  id: any,
  storeId: string,
  approvedById: string
) {
  try {
    const amount = parseFloat(data.amount);

    const user = await db.user.findUnique({
      where: { id: '4' },
    });

    if (!user) {
      throw new Error('User with id not found.');
    }

    const bankAccount = await db.bankAccount.findUnique({
      where: {
        id: id,
      },
    });

    if (!bankAccount) {
      throw new Error('Bank Account Id not found.');
    }

    const bankId = bankAccount.id;

    const now = new Date();
    const withdraw = await db.withdraw.create({
      data: {
        store: {
          connect: { id: '1' },
        },
        amount: amount,
        status: 'REQUEST',
        // attachment: data.attachment,
        bankAccount: {
          connect: { id: bankId },
        },
        approvedBy: {
          connect: { id: '1' },
        },
        updatedAt: now,
      },
    });

    return withdraw;
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    throw error;
  }
}

export async function deleteWithdraw(id: string) {
  return await db.withdraw.delete({
    where: { id: id },
  });
}

export async function createDeclinedReason(
  data: any,
  withdrawId: string,
  storeId: string
) {
  const createReason = await db.adminDecline.create({
    data: {
      withdraw: {
        connect: {
          id: withdrawId,
        },
      },
      store: {
        connect: {
          id: storeId,
        },
      },
      reason: data.reason,
    },
  });
  console.log('this is reason declined:', createReason);

  return createReason;
}

export async function createAttachmentAdmin(
  attachmentUrl: string,
  withdrawId: string
) {
  try {
    const createAttachment = await db.attachmentAdmin.create({
      data: {
        withdraw: {
          connect: {
            id: withdrawId,
          },
        },
        attachment: attachmentUrl,
      },
    });

    console.log('Attachment creation success:', createAttachment);

    return createAttachment;
  } catch (error) {
    console.error('Error creating attachment:', error);
    throw error;
  }
}

// adminDecline

export async function getReasonDeclined() {
  const reasonDeclinedList = await db.adminDecline.findMany({
    include: {
      store: true,
      withdraw: true,
    },
  });

  return reasonDeclinedList;
}
