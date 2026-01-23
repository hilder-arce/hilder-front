import { CommonModule } from "@angular/common";
import { Component, computed, OnInit, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { LoaderComponent } from "../../../../../../shared/componets/loader/loader.component";
import { MaterialService } from "../services/material.service";
import { Material } from "../interfaces/material.interface";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { FormsModule } from "@angular/forms";
import { MaterialsSearchService } from "../services/materials-search.service";

@Component({
  selector: 'app-list-material',
  standalone: true,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LoaderComponent
  ]
})
export class ListMaterialComponent implements OnInit {

  constructor(
    private materialService: MaterialService,
    private alertService: AlertService,
    private router: Router,
    private searchService: MaterialsSearchService,
  ) {}

  // STATE
  materials = signal<Material[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadMaterials();
  }

  // CARGAR MATERIALES
  async loadMaterials() {
    try {
      this.isLoading.set(true);
      const res = await this.materialService.getMateriales();
      if (res) this.materials.set(res);
    } catch {
      this.alertService.show('Error al cargar materiales', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  // EDITAR MATERIAL
  editMaterial(material: Material) {
    this.router.navigate(
      ['/dashboard/config/materiales/create'],
      { queryParams: { _id: material._id } }
    );
  }

  // DESACTIVAR MATERIAL
  async eliminarMaterial(material: Material) {
    if (!material._id) return;

    const confirmed = await this.alertService.confirm(
      `¿Está seguro de desactivar el material <b>${material.nombre}</b>?`,
      {
        title: 'Desactivar material',
        confirmText: 'Sí, desactivar',
        cancelText: 'Cancelar',
        danger: true
      }
    );

    if (!confirmed) return;

    try {
      const res = await this.materialService.deactivateMaterial(material._id);
      if (res?.message) {
        this.alertService.show(`Material \"${material.nombre}\" desactivado con éxito`, 'success', 'Desactivación exitosa');
        this.loadMaterials();
      }
    } catch (error: any) {
      const errorMessage = error?.error?.message || 'Error al desactivar material';
      this.alertService.show(errorMessage, 'error', 'Error en la desactivación');
    }
  }

  // ACTIVAR MATERIAL
  async activarMaterial(material: Material) {
    if (!material._id) return;

    try {
      const res = await this.materialService.activateMaterial(material._id);
      if (res?.message) {
        this.alertService.show(`Material \"${material.nombre}\" activado con éxito`, 'success', 'Activación exitosa');
        this.loadMaterials();
      }
    } catch (error: any) {
      const errorMessage = error?.error?.message || 'Error al activar material';
      this.alertService.show(errorMessage, 'error', 'Error en la activación');
    }
  }

  filterMaterials = computed(() => {
    const searchTerm = this.searchService.search().toLowerCase();
    if (!searchTerm) return this.materials();

    return this.materials().filter(m =>
      m.nombre.toLowerCase().includes(searchTerm) ||
      m.unidad.toLowerCase().includes(searchTerm) ||
      m.descripcion.toLowerCase().includes(searchTerm)
    );
  });

}
