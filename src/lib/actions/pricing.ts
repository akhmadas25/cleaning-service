"use server";

import { prisma } from "@/lib/prisma";
import { ServiceType } from "@prisma/client";

export async function getServicePricing(serviceType: ServiceType) {
  const pricing = await prisma.servicePricing.findUnique({
    where: { serviceType },
  });
  return pricing;
}

export async function getAllServicePricing() {
  const pricing = await prisma.servicePricing.findMany();
  return pricing;
}
