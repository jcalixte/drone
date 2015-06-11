<?php
namespace Drone\UserBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

class UserAdmin extends Admin
{
	// Fields to be shown on create/edit forms
	protected function configureFormFields(FormMapper $formMapper) {
		$formMapper
			->add('firstname', 'text', array('label' => 'Prénom'))
			->add('lastname', 'text', array('label' => 'Nom'))
			->add('address', 'text', array('label' => 'Adresse'))
			->add('country', 'text', array('label' => 'Pays'))
			->add('city', 'text', array('label' => 'Ville'))
			->add('zipcode', 'text', array('label' => 'Code postal'))
			->add('drones', 'entity', array('class' => 'Drone\MapBundle\Entity\Drone'))
		;
	}

	// Fields to be shown on filter forms
	protected function configureDatagridFilters(DatagridMapper $datagridMapper) {
		$datagridMapper
			->add('firstname')
			->add('lastname')
			->add('city')
			->add('country')
		;
	}

	// Fields to be shown on lists
	protected function configureListFields(ListMapper $listMapper) {
		$listMapper
			->add('firstname')
			->addIdentifier('lastname')
			->add('address', 'text', array('label' => 'Adresse'))
			->add('country')
			->add('city')
			->add('zipcode', 'text', array('label' => 'Code postal'))
			->add('imageFile', 'file')
			->add('drones', 'entity', array('class' => 'Drone\MapBundle\Entity\Drone'))
		;
	}
}
