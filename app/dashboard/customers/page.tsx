"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { CustomersTable } from "@/components/customers/customers-table"
import { CustomerForm } from "@/components/customers/customer-form"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus } from "lucide-react"
import { dataStore } from "@/lib/store"
import type { Customer } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>()
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setCustomers(dataStore.getCustomers())
  }, [])

  const handleAddCustomer = (data: Partial<Customer>) => {
    const newCustomer = dataStore.addCustomer({
      ...data,
      storeId: "store-1",
    } as Omit<Customer, "id" | "createdAt">)
    setCustomers(dataStore.getCustomers())
    toast({
      title: "Customer Added",
      description: `${newCustomer.name} has been added.`,
    })
  }

  const handleUpdateCustomer = (data: Partial<Customer>) => {
    if (selectedCustomer) {
      dataStore.updateCustomer(selectedCustomer.id, data)
      setCustomers(dataStore.getCustomers())
      toast({
        title: "Customer Updated",
        description: `${data.name} has been updated.`,
      })
    }
  }

  const handleDeleteCustomer = () => {
    if (deleteCustomer) {
      dataStore.deleteCustomer(deleteCustomer.id)
      setCustomers(dataStore.getCustomers())
      toast({
        title: "Customer Deleted",
        description: `${deleteCustomer.name} has been removed.`,
        variant: "destructive",
      })
      setDeleteCustomer(null)
    }
  }

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsFormOpen(true)
  }

  const handleOpenForm = () => {
    setSelectedCustomer(undefined)
    setIsFormOpen(true)
  }

  return (
    <div className="flex flex-col">
      <Header title="Customers" description="Manage your customer database" />
      <div className="flex-1 space-y-4 p-4 lg:p-6">
        <div className="flex justify-end">
          <Button onClick={handleOpenForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
        <CustomersTable customers={customers} onEdit={handleEdit} onDelete={setDeleteCustomer} />
      </div>

      <CustomerForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        customer={selectedCustomer}
        onSubmit={selectedCustomer ? handleUpdateCustomer : handleAddCustomer}
      />

      <AlertDialog open={!!deleteCustomer} onOpenChange={() => setDeleteCustomer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteCustomer?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCustomer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}
