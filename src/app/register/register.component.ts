import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import data from "../register/Cars.json";
import _carBrands from "../register/Brands.json";
import datos from "../register/Location.json";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { StorageServiceComponent } from "../services/storage.service";

interface Province {
  name: string;
  value: Municipality[];
}

interface Municipality {
  name: string;
  sectores: string[];
}

interface TipoVehiculo {
  tipo: string;
  marcas: Marca[];
}

interface Marca {
  marca: string;
  modelos: string[];
}

interface Location {
  Adress: string;
  Adress2: string;
  Provincia: string;
  Municipio: string;
  Sector: string;
}

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  form: any = {
    inputName: null,
    inputLastName: null,
    inputNumber: null,
    inputID: null,
    inputMail: null,
    inputPassword: null,
    inputAddress: null,
    inputAddress2: null,
    inputProvince: null,
    inputCity: null,
    inputSector: null,
    inputType: null,
    inputBrand: null,
    inputModel: null,
    inputTypeT: null,
    inputBrandT: null,
    inputModelT: null,
    inputYear: null,
    inputCarID: null,
    inputNameWorkshop: null,
    inputNumberW: null,
    inputMailW: null,
    inputPasswordW: null,
    inputImage: null,
    inputCertificate: null,
    inputWorkshopID: null,
    inputAddressW: null,
    inputAddress2W: null,
    inputProvinceW: null,
    inputCityW: null,
    inputSectorW: null,
    inputBrandW: null,
    inputServices: null,
    inputServiceDescription: null,
  };

  // Declara la propiedad base64Image
  base64Image: string | null = null;
  // Si estás manejando también un certificado como base64
  base64Certificate: string | null = null;

  showAddFields: boolean = false;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = "";

  mostrarDiv1 = true;
  mostrarDiv2 = false;
  mostrarDiv3 = false;
  mostrarDiv4 = false;

  Buttons = true;

  hasWarnings2: boolean = false;
  hasWarnings: boolean = false;
  isWarningShown: boolean = false;

  tiposDeVehiculo: TipoVehiculo[] = data.tiposDeVehiculo;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private storageService: StorageServiceComponent
  ) {}

  ngOnInit(): void {
    const currentUser2 = this.storageService.getUser().roles;
    if (currentUser2 == "ROLE_USER" || currentUser2 == "ROLE_MODERATOR") {
      setTimeout(() => {
        this.router.navigate(["/inicio"]);
      });
    }
  }

  SelectedType: string = "";
  selectedBrand: string = "";
  selectedBrandW: string = "";
  selectedModel: string = "";

  brands = data;

  carBrands: { id: number; name: string }[] = _carBrands.brands;

  get models() {
    const brand = this.brands.tiposDeVehiculo
      .flatMap((tipo) => tipo.marcas)
      .filter((marca) => marca.marca === this.selectedBrand);
    return brand.length > 0 ? brand[0].modelos : [];
  }

  private isLocationDuplicate(location: Location): boolean {
    return this.addedLocations.some(
      (addedLocation) =>
        addedLocation.Adress === location.Adress &&
        addedLocation.Adress2 === location.Adress2 &&
        addedLocation.Provincia === location.Provincia &&
        addedLocation.Municipio === location.Municipio &&
        addedLocation.Sector === location.Sector
    );
  }

  getFilteredBrands() {
    if (this.SelectedType) {
      const tipoVehiculo = this.tiposDeVehiculo.find(
        (tipo) => tipo.tipo === this.SelectedType
      );
      return tipoVehiculo ? tipoVehiculo.marcas : [];
    }
    return [];
  }

  getFilteredModels() {
    if (this.form.inputBrand) {
      const tipoVehiculo = this.tiposDeVehiculo.find(
        (tipo) => tipo.tipo === this.form.inputType
      );
      if (tipoVehiculo) {
        const marca = tipoVehiculo.marcas.find(
          (m) => m.marca === this.form.inputBrand
        );
        return marca ? marca.modelos : [];
      }
    }
    return [];
  }

  capturarValoresCars() {
    this.hasWarnings2 = false;
    if (
      this.SelectedType &&
      this.selectedBrand &&
      this.selectedModel &&
      this.form.inputYear &&
      this.form.inputCarID
    ) {
      const currentVehicle = {
        type: this.SelectedType,
        brand: this.selectedBrand,
        model: this.selectedModel,
        year: this.form.inputYear,
        carId: this.form.inputCarID,
      };

      // Verifica si el vehículo ya existe en el arreglo
      const isDuplicate = this.addedVehicles.some(
        (vehicle) =>
          vehicle.type === currentVehicle.type &&
          vehicle.brand === currentVehicle.brand &&
          vehicle.model === currentVehicle.model &&
          vehicle.year === currentVehicle.year &&
          vehicle.carId === currentVehicle.carId
      );

      if (isDuplicate) {
        this.hasWarnings2 = true;
        // Aquí puedes mostrar un mensaje de advertencia para informar al usuario sobre la duplicación
        console.error("El vehículo ya ha sido añadido previamente.");
        this.SelectedType = "";
        this.selectedBrand = "";
        this.selectedModel = "";
        this.form.inputYear = null;
        this.form.inputCarID = null;
        return;
      }
      this.addedVehicles.push(currentVehicle);
      this.SelectedType = "";
      this.selectedBrand = "";
      this.selectedModel = "";
      this.form.inputYear = null;
      this.form.inputCarID = null;
    }
  }

  capturarValoresCarsSend() {
    if (this.hasWarnings2) {
      this.errorMessage =
        "Hay advertencias activas. Por favor, resuelve los problemas antes de continuar.";
      return;
    } else {
      if (
        this.SelectedType &&
        this.selectedBrand &&
        this.selectedModel &&
        this.form.inputYear &&
        this.form.inputCarID
      ) {
        this.addedVehicles.push({
          type: this.SelectedType,
          brand: this.selectedBrand,
          model: this.selectedModel,
          year: this.form.inputYear,
          carId: this.form.inputCarID,
        });
      }
    }
  }

  contador2: number = 1;
  capturarValoresBrand(reset?: boolean, addBrand?: boolean) {
    if (reset && addBrand) {
      this.hasWarnings = false;
      this.selectedBrandW = "";
    }

    if (
      this.selectedBrandW &&
      !this.selectedBrandsWorkshop.includes(this.selectedBrandW)
    ) {
      if (addBrand) {
        this.selectedBrandsWorkshop.push(this.selectedBrandW);
        this.contador2++;
      }

      if (reset) {
        this.selectedBrandW = "";
      }
    } else {
      this.errorMessage = "Marca inválida o repetida";
      this.isSignUpFailed = true;
      this.selectedBrandW = "";
    }
  }

  provinces: Province[] = datos.province;

  selectedProvince: string = "";
  selectedMunicipality: string = "";
  selectedSector: string = "";

  get municipalities() {
    const province = this.provinces.find(
      (p) => p.name === this.selectedProvince
    );
    return province ? province.value : [];
  }

  get sectors() {
    const municipality = this.municipalities.find(
      (m) => m.name === this.selectedMunicipality
    );
    return municipality ? municipality.sectores : [];
  }

  capturarValoresLocations() {}

  _contador: number = 1;
  capturarValoresLocationsW(
    sendOnly = false,
    addNew = false,
    cleanFields = true
  ): void {
    if (!sendOnly && !addNew && cleanFields) {
      this.isWarningShown = false;
    }

    if (this.isWarningShown) {
      return;
    }

    if (sendOnly) {
      return;
    }

    if (
      this.form.inputAddressW &&
      this.form.inputAddress2W &&
      this.selectedProvinceW &&
      this.selectedMunicipalityW &&
      this.selectedSectorW
    ) {
      const newLocation = {
        Adress: this.form.inputAddressW,
        Adress2: this.form.inputAddress2W,
        Provincia: this.selectedProvinceW,
        Municipio: this.selectedMunicipalityW,
        Sector: this.selectedSectorW,
      };

      if (!this.isLocationDuplicate(newLocation)) {
        this.addedLocations.push(newLocation);
        this._contador++;

        if (cleanFields) {
          this.selectedProvinceW = "";
          this.selectedMunicipalityW = "";
          this.selectedSectorW = "";
          this.form.inputAddressW = null;
          this.form.inputAddress2W = null;
        }
      } else {
        console.log("Location already added!");
        this.selectedProvinceW = "";
        this.selectedMunicipalityW = "";
        this.selectedSectorW = "";
        this.form.inputAddressW = null;
        this.form.inputAddress2W = null;
      }
    }
  }

  selectedBrandsWorkshop: string[] = [];

  addedVehicles: {
    type: string;
    brand: string;
    model: string;
    year: string;
    carId: string;
  }[] = [];

  direcciones: any[] = [];

  addedLocations: {
    Adress: string;
    Adress2: string;
    Provincia: string;
    Municipio: string;
    Sector: string;
  }[] = [];

  services: { service: string; description: string }[] = [];
  contador3: number = 1;
  capturarValoresService(sendOnly = false, addNew = false): void {
    if (sendOnly) {
      if (this.form.inputServices && this.form.inputServiceDescription) {
        const serviceObj = {
          service: this.form.inputServices,
          description: this.form.inputServiceDescription,
        };

        this.services.push(serviceObj);
        this.contador3++;

        if (addNew) {
          this.form.inputServices = null;
          this.form.inputServiceDescription = null;
        }
      }
    }
  }

  capturarValoresServiceAndBrand(): void {
    if (this.hasWarnings) {
      this.errorMessage =
        "Hay advertencias activas. Por favor, resuelve los problemas antes de continuar.";
      return;
    } else {
      this.capturarValoresService(true, false);
      this.capturarValoresBrand(false, true);
    }
  }

  provincesW: Province[] = datos.province;

  selectedProvinceW: string = "";
  selectedMunicipalityW: string = "";
  selectedSectorW: string = "";

  get municipalitiesW() {
    const province = this.provincesW.find(
      (p) => p.name === this.selectedProvinceW
    );
    return province ? province.value : [];
  }

  get sectorsW() {
    const municipality = this.municipalitiesW.find(
      (m) => m.name === this.selectedMunicipalityW
    );
    return municipality ? municipality.sectores : [];
  }

  cambiarEstadoDiv1() {
    this.mostrarDiv1 = true;
    this.mostrarDiv2 = false;
    this.mostrarDiv3 = false;
    this.mostrarDiv4 = false;
  }
  cambiarEstadoDiv2() {
    this.Buttons = true;
    this.mostrarDiv1 = false;
    this.mostrarDiv2 = true;
    this.mostrarDiv3 = false;
    this.mostrarDiv4 = false;
  }
  cambiarEstadoDiv3() {
    this.Buttons = false;
    this.mostrarDiv1 = false;
    this.mostrarDiv2 = false;
    this.mostrarDiv3 = true;
    this.mostrarDiv4 = false;
  }

  cambiarEstadoDiv4() {
    this.mostrarDiv1 = false;
    this.mostrarDiv2 = false;
    this.mostrarDiv3 = false;
    this.mostrarDiv4 = true;
  }

  validarYCambiardiv3(formulario: any) {
    if (formulario.valid) {
      this.cambiarEstadoDiv3();
    } else {
    }
  }

  validarYCambiardiv4(formulario: any) {
    if (formulario.valid) {
      this.cambiarEstadoDiv4();
    } else {
    }
  }

  onSubmit(): void {
    const {
      inputName,
      inputLastName,
      inputNumber,
      inputID,
      inputMail,
      inputPassword,
      inputAddress,
      inputAddress2,
    } = this.form;

    const vehicles = this.addedVehicles.map((vehicle) => ({
      inputType: vehicle.type,
      inputBrand: vehicle.brand,
      inputModel: vehicle.model,
      inputYear: vehicle.year,
      inputCarID: vehicle.carId,
    }));

    const inputProvince = this.selectedProvince;
    const inputCity = this.selectedMunicipality;
    const inputSector = this.selectedSector;

    this.authService
      .register(
        inputName,
        inputLastName,
        inputNumber,
        inputID,
        inputMail,
        inputPassword,
        inputAddress,
        inputAddress2,
        inputProvince,
        inputCity,
        inputSector,
        vehicles
      )
      .subscribe({
        next: (data) => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.messageService.add({
            severity: "success",
            summary: "Éxito",
            detail: "Registro Satisfactorio!",
          });
          this.router.navigate(["/ingreso"]);
          this.messageService.add({
            severity: "warn",
            summary: "ATENCION!",
            detail:
              "¡Hemos enviado un mensaje de validación a su correo electrónico para verificar su usuario!",
            life: 30000,
          });
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          this.hasWarnings2 = true;
          this.messageService.add({
            severity: "warn",
            summary: "Advertencia",
            detail: this.errorMessage,
          });
          this.isSignUpFailed = true;
        },
      });
  }

  private fileToUpload: File | null = null;

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let file: File | null = null;

    if (element.files !== null) {
      file = element.files[0];
    }

    this.fileToUpload = file;
  }

  private fileToUpload2: File | null = null;

  onFileSelected2(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let file2: File | null = null;

    if (element.files !== null) {
      file2 = element.files[0];
    }

    this.fileToUpload2 = file2;
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.base64Image = reader.result as string;
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  }

  onSubmitWorkshop(): void {
    const {
      inputNameWorkshop,
      inputNumberW,
      inputMailW,
      inputPasswordW,
      inputWorkshopID,
    } = this.form;

    if (
      !inputNameWorkshop ||
      !inputNumberW ||
      !inputMailW ||
      !inputPasswordW ||
      !inputWorkshopID
    ) {
      this.errorMessage = "Por favor, Completa todos los campos requeridos!";
      this.isSignUpFailed = true;
      return;
    }

    const inputBrandW = this.selectedBrandsWorkshop;

    if (!inputBrandW || inputBrandW.length === 0) {
      this.errorMessage = "Por favor, Selecciona al menos una marca";
      this.isSignUpFailed = true;
      return;
    }

    if (!this.addedLocations || this.addedLocations.length === 0) {
      this.errorMessage = "Por favor, Añade al menos una ubicación";
      this.isSignUpFailed = true;
      return;
    }

    const locations = this.addedLocations.map((location) => ({
      Adress: location.Adress,
      Adress2: location.Adress2,
      Province: location.Provincia,
      city: location.Municipio,
      Sector: location.Sector,
    }));

    const services = [];
    for (let i = 0; i < this.services.length; i++) {
      const service = this.services[i];
      if (service.service && service.description) {
        services.push({
          inputService: service.service,
          inputServiceDescription: service.description,
        });
      }
    }

    if (this.base64Image && this.fileToUpload2) {
      const inputImage = this.base64Image;
      const inputCertificate = this.fileToUpload2;
      this.authService
        .registerWorkshop(
          inputNameWorkshop,
          inputNumberW,
          inputMailW,
          inputPasswordW,
          inputImage,
          inputCertificate,
          inputWorkshopID,
          locations,
          inputBrandW,
          services
        )
        .subscribe({
          next: (data) => {
            this.isSuccessful = true;
            this.isSignUpFailed = false;
            this.messageService.add({
              severity: "success",
              summary: "Éxito",
              detail: "Registro Satisfactorio!",
            });
            this.router.navigate(["/ingreso"]);
            this.messageService.add({
              severity: "warn",
              summary: "ATENCION!",
              detail:
                "Su cuenta está actualmente bajo verificación. Al finalizar este proceso, se le enviará un correo de confirmación.",
              life: 30000,
            });
          },
          error: (err) => {
            this.errorMessage = err.error.message;
            this.hasWarnings = true;
            this.messageService.add({
              severity: "warn",
              summary: "Advertencia",
              detail: this.errorMessage,
            });
            this.isSignUpFailed = true;
            this.isWarningShown = true;
          },
        });
    } else {
      this.errorMessage = "La Imagen del Taller no ha seleccionada!";
      this.isSignUpFailed = true;
      this.hasWarnings = true;
      this.isWarningShown = true;
      this.messageService.add({
        severity: "warn",
        summary: "Advertencia",
        detail: this.errorMessage,
      });
    }
  }
}
