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
import { Plus, Loader2 } from "lucide-react"
import { customerApi } from "@/lib/api-client"
import type { Customer } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>()
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    setIsLoading(true)
    try {
      const res = await customerApi.list(0, 100)
      if (res.error) {
        toast({
          title: "Failed to load customers",
          description: res.error,
          variant: "destructive",
        })
        setCustomers([])
      } else {
        setCustomers(res.data?.content || [])
      }
    } catch (error) {
      toast({
        title: "Error loading customers",
        description: "Unable to load customer data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCustomer = async (data: Partial<Customer>) => {
    setIsSaving(true)
    try {
      const res = await customerApi.create(data)
      if (res.error) {
        toast({
          title: "Failed to add customer",
          description: res.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Customer Added",
          description: `${data.name} has been added.`,
        })
        setIsFormOpen(false)
        await loadCustomers()
      }
    } catch (error) {
      toast({
        title: "Error adding customer",
        description: "Unable to create customer",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateCustomer = async (data: Partial<Customer>) => {
    if (selectedCustomer) {
      setIsSaving(true)
      try {
        const res = await customerApi.update(selectedCustomer.id, {
          ...selectedCustomer,
          ...data
        })
        if (res.error) {
          toast({
            title: "Failed to update customer",
            description: res.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Customer Updated",
            description: `${data.name} has been updated.`,
          })
          setIsFormOpen(false)
          setSelectedCustomer(undefined)
          await loadCustomers()
        }
      } catch (error) {
        toast({
          title: "Error updating customer",
          description: "Unable to update customer",
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleDeleteCustomer = async () => {
    if (deleteCustomer) {
      setIsSaving(true)
      try {
        const res = await customerApi.delete(deleteCustomer.id)
        if (res.error) {
          toast({
            title: "Failed to delete customer",
            description: res.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Customer Deleted",
            description: `${deleteCustomer.name} has been removed.`,
            variant: "destructive",
          })
          setDeleteCustomer(null)
          await loadCustomers()
        }
      } catch (error) {
        toast({
          title: "Error deleting customer",
          description: "Unable to delete customer",
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
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
          <Button 
            onClick={handleOpenForm}
            disabled={isLoading || isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add Customer
          </Button>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <CustomersTable 
            customers={customers} 
            onEdit={handleEdit} 
            onDelete={setDeleteCustomer}
          />
        )}
      </div>

      <CustomerForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        customer={selectedCustomer}
        onSubmit={selectedCustomer ? handleUpdateCustomer : handleAddCustomer}
        isSaving={isSaving}
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
              disabled={isSaving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )}